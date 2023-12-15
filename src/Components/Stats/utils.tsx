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
    let printerStatus = entity( mqtt ? '_print_status' : '_current_state')?.state;
    const entity_attrs = entity('_print_progress')?.attributes || undefined;
    // Add custom entites
    let cus_entity, cus_attr: string, cus_name: string;
    if (config.sensors)
    {
        const cus_sensor = condition in config.sensors ? config.sensors[condition] : undefined;
        cus_entity = cus_sensor ? getEntity(hass, cus_sensor['entity']) : undefined;
        cus_attr =  cus_entity ? cus_entity.attributes[cus_sensor['attribute']] : undefined;
        cus_name =  cus_sensor ? cus_sensor['name'] : undefined;
        
        // Status
        const cus_status = ThreedyCondition.Status in config.sensors ? config.sensors[ThreedyCondition.Status] : undefined;
        const status_entity = cus_status ? getEntity(hass, cus_status['entity']) : undefined,
                status_attr = status_entity?.attributes[cus_status['attribute']] || undefined
        printerStatus = printerStatus || status_attr || status_entity?.state
    }

    switch (condition) {
        case ThreedyCondition.Status:
            return (
                <Stat
                    name={"Status"}
                    value={printerStatus}
                    attr={cus_attr != undefined ? cus_attr : undefined}
                />
            )
        case ThreedyCondition.ETA:
            return (
                <TimeStat
                    name = {cus_name || undefined}
                    timeEntity={ cus_entity != undefined ? cus_entity : mqtt ? entity('_print_time_left') : entity('_estimated_finish_time') }
                    attr={cus_attr != undefined ? cus_attr : mqtt ? entity_attrs?.printTimeLeft : undefined}
                    condition={condition}
                    config={config}
                    direction={0}
                    status={printerStatus}
                />
            )
        case ThreedyCondition.Elapsed:
            return (
                <TimeStat
                    name = {cus_name || undefined}
                    timeEntity={ cus_entity != undefined ? cus_entity : mqtt ? entity('_print_time') : entity('_start_time')  }
                    attr={cus_attr != undefined ? cus_attr : mqtt ? entity_attrs?.printTime : undefined}
                    condition={condition}
                    config={config}
                    direction={1}
                    status={printerStatus}
                />
            )

        case ThreedyCondition.Remaining:
            return (
                <TimeStat
                    name = {cus_name || undefined}
                    timeEntity={ cus_entity != undefined ? cus_entity : mqtt ? entity('_print_time_left') : entity('_estimated_finish_time') }
                    attr={cus_attr != undefined ? cus_attr : mqtt ? entity_attrs?.printTimeLeft : undefined}
                    condition={condition}
                    config={config}
                    direction={-1}
                    status={printerStatus}
                />
            )

        case ThreedyCondition.Bed:
            return (
                <TemperatureStat
                    name={cus_name || "Bed"}
                    temperatureEntity={ cus_entity != undefined ? cus_entity : entity( mqtt ? '_bed_temperature' : '_actual_bed_temp' ) }
                    attr={cus_attr || undefined}
                    config={config}
                />
            )

        case ThreedyCondition.Hotend:
            return (
                <TemperatureStat
                    name={cus_name || "Hotend"}
                    temperatureEntity={ cus_entity != undefined ? cus_entity : entity( mqtt ? '_tool_0_temperature' : '_actual_tool0_temp' ) }
                    attr={cus_attr || undefined}
                    config={config}
                />
            )


        default:
            return (
                <Stat
                    name={ cus_name || "Unknown" }
                    value={ cus_attr != undefined ? cus_attr : cus_entity?.state != undefined ? cus_entity?.state : "<unknown>"}
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
        condition => renderCondition(hass, config, condition)
    )

}

const percentComplete = (
    hass: HomeAssistant,
    config: ThreedyConfig
) => {
    let cus_sensor = config.sensors ? config.sensors['Progress'] || config.sensors['progress'] : undefined;
    let cus_entity = cus_sensor ? getEntity(hass, cus_sensor['entity']) : undefined;
    let cus_attr = cus_entity?.attributes[cus_sensor['attribute']] || undefined;
    return (
        cus_attr || cus_entity?.state || 
        (hass.states[config.use_mqtt ? `${config.base_entity}_print_progress` : `${config.base_entity}_job_percentage`] || { state: -1.0 }).state
    );
    // return (hass.states[config.use_mqtt ? `${config.base_entity}_print_progress` : `${config.base_entity}_job_percentage`] || { state: -1.0 }).state;

}

export {
    renderStats,
    percentComplete
}
