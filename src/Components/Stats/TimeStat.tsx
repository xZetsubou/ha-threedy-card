import React, {useEffect, useState} from "react";
import {HassEntity} from "home-assistant-js-websocket";
import {ThreedyCondition, ThreedyConfig} from "../../types";
import Stat from "./Stat";
import moment from 'moment';

const formatDuration = (
    time: number,
    round: boolean
) => {
    return (
        round ? moment.duration(time, "seconds").humanize() : (() => {

            const t = moment.duration(time, 'seconds');

            const d = t.days();
            const h = t.hours();
            const m = t.minutes();
            const s = t.seconds();


            return `${d > 0 ? `${d}d` : ''}${h > 0 ? ` ${h}h` : ''}${m > 0 ? ` ${m}m` : ''}${s > 0 ? ` ${s}s` : ''}`

        })()
    )
}

const renderTime = (
    time: number,
    condition: ThreedyCondition,
    config: ThreedyConfig
) => {

    const r = config.round_time;

    switch (condition) {
        case ThreedyCondition.Remaining:
            return formatDuration(time, r)
        case ThreedyCondition.ETA:
            return moment().add(time, 'seconds').format(config.use_24hr ? "HH:mm" : "h:mm a")
        case ThreedyCondition.Elapsed:
            return formatDuration(time, r)
        default:
            return '<unknown>'
    }
}

const isIsoDate = (str: string) => {
    if( str.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})[+-](\d{2})\:(\d{2})/) ) {
        return true;
    } else {
        return false
    }
    
}

const ConvertIsoDate = (str: string) => {
    const pad = (num: number) => { num = Math.round(num); return ((num < 10) ? '0' + num.toString() : num.toString()).replace("-","");}
    var time = +(new Date(str)) - Date.now() ;
    let secs = time / 1000, hrs = Math.trunc( secs / 3600 ), mins = Math.trunc( (secs % 3600) / 60 );
    secs = secs % 60
    
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}

const getTotalSeconds = (
    timeEntity: HassEntity,
    config: ThreedyConfig,
    attr: string
) => { 
    let state = attr?.toString() || timeEntity?.state?.toString() || undefined;
    state = isIsoDate(state) ? ConvertIsoDate(state) : state;

    let result;   
    if (state != undefined) {
        const [hours, minutes, seconds] = state?.toString()?.split(':') ? state?.toString().split(':') : undefined;
        result = ![hours,minutes,seconds].includes(undefined) ? (+hours) * 60 * 60 + (+minutes) * 60 + (+seconds) 
        : result = parseInt(state);
    }
    else { result = 0; }
            
    return result;
}


type TimeStatProps = {
    timeEntity: HassEntity,
    condition: ThreedyCondition
    config: ThreedyConfig,
    direction: number
    status: string
    attr: string
}

const TimeStat: React.FC<TimeStatProps> = ({timeEntity, name, condition, config, direction, status, attr}) => {
    const totalSeconds = getTotalSeconds(timeEntity, config, attr);
    const [ time, setTime ] = useState<number>(totalSeconds);
    const [ lastIntervalId, setLastIntervalId ] = useState<number>(-1);

    const incTime = () => setTime( time => (parseInt(time) + parseInt(direction)) );
    const showEmpty = status != "Printing";

    useEffect(() => {

        if (lastIntervalId !== -1) clearInterval(lastIntervalId);

        setTime(getTotalSeconds(timeEntity, config, attr));

        const id = setInterval(
            incTime,
            1000
        );

        setLastIntervalId(id);

    }, [timeEntity]);

    return (
        <Stat
            name={name || condition}
            value={ showEmpty ? "-" : renderTime(time, condition, config )}
        />
    )


}

export default TimeStat;
