import React from 'react';
import {HomeAssistant, ThreedyCondition, ThreedyConfig} from "../../types";
import TemperatureStat from "./TemperatureStat";
import { getEntity } from '../../Utils/HomeAssistant';
import Stat from "./Stat";
import TimeStat from "./TimeStat";


/*


    const entityEnding = (() => {
        switch (condition) {
            case 'Status':
                return config.use_mqtt ? '_print_status' : '_current_state'
            case 'ETA':
                return config.use_mqtt ? '_print_time_left' : '_time_remaining'
            case 'Elapsed':
                return config.use_mqtt ? '_print_time' : '_time_elapsed'
            case 'Hotend':
                return config.use_mqtt ? '_tool_0_temperature' : '_actual_tool0_temp'
            case 'Bed':
                return config.use_mqtt ? '_bed_temperature' : '_actual_bed_temp'
            default:
                return undefined
        }
    })();


 */


/**
 * Function to dynamically render a stat by determining what type of stat it is
 * @param hass
 * @param config
 * @param condition
 */
const renderCondition = (
    hass: HomeAssistant,
    config: ThreedyConfig,
    condition: ThreedyCondition | string
) => {

    const entity = (suffix: string) => getEntity(hass, `${config.base_entity}${suffix}`);
    const mqtt = config.use_mqtt;
    const printerStatus = entity( mqtt ? '_print_status' : '_current_state').state;
    const entity_attrs = entity('_print_progress').attributes || undefined;

    switch (condition) {
        case ThreedyCondition.Status:
            return (
                <Stat
                    name={"Status"}
                    value={printerStatus}
                />
            )
        case ThreedyCondition.ETA:
            return (
                <TimeStat
                    timeEntity={ mqtt ? entity('_print_time_left') : entity('_time_remaining') }
                    attr={mqtt ? entity_attrs.printTimeLeft : undefined}
                    condition={condition}
                    config={config}
                    direction={0}
                    status={printerStatus}
                />
            )
        case ThreedyCondition.Elapsed:
            return (
                <TimeStat
                    timeEntity={ mqtt ? entity('_print_time') : entity('_time_elapsed')  }
                    attr={mqtt ? entity_attrs.printTime : undefined}
                    condition={condition}
                    config={config}
                    direction={1}
                    status={printerStatus}
                />
            )

        case ThreedyCondition.Remaining:
            return (
                <TimeStat
                    timeEntity={ mqtt ? entity('_print_time_left') : entity('_time_remaining') }
                    attr={mqtt ? entity_attrs.printTimeLeft : undefined}
                    condition={condition}
                    config={config}
                    direction={-1}
                    status={printerStatus}
                />
            )

        case ThreedyCondition.Bed:
            return (
                <TemperatureStat
                    name={"Bed"}
                    temperatureEntity={ entity( mqtt ? '_bed_temperature' : '_actual_bed_temp' ) }
                    config={config}
                />
            )

        case ThreedyCondition.Hotend:
            return (
                <TemperatureStat
                    name={"Hotend"}
                    temperatureEntity={ entity( mqtt ? '_tool_0_temperature' : '_actual_tool0_temp' ) }
                    config={config}
                />
            )


        default:
            return (
                <Stat
                    name={"Unknown"}
                    value={"<unknown>"}
                />
            )

    }

}

/**
 * Function to render all stats
 * @param hass
 * @param config
 */
const renderStats = (
    hass: HomeAssistant,
    config: ThreedyConfig
) => {

    return config.monitored.map(
        condition => renderCondition( hass, config, condition )
    )

}

const percentComplete = (
    hass: HomeAssistant,
    config: ThreedyConfig
) => {
    return (hass.states[config.use_mqtt ? `${config.base_entity}_print_progress` : `${config.base_entity}_job_percentage`] || { state: -1.0 }).state;
}

export {
    renderStats,
    percentComplete
}
