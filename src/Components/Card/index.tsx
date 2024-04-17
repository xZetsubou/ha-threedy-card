import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { IoPower } from 'react-icons/io5'
import { FaRegLightbulb, FaLightbulb } from 'react-icons/fa';

import ThreedyContext from '../../Contexts/ThreedyContext';
import toggleEntity from '../../Utils/Toggle';

import PrinterView from '../PrinterView';
import Stats from '../Stats';

import styles from './styles';
import Camera from "../Camera";
import {percentComplete} from "../Stats/utils";
import { ThreedyCondition } from '../../types';


const Card = ({ }) => {

    const {
        config,
        hass
    } = useContext(ThreedyContext);

    const [
        hiddenOverride,
        setHiddenOveride
    ] = useState(config.always_show ?? false);

    const [
        showVideo,
        setShowVideo
    ] = useState(false);

    const toggleVideo = config.camera_entity ? () => {
        setShowVideo(!showVideo)
    } : () => {}


    const cameraEntity = config.camera_entity ? hass.states[config.camera_entity] || undefined : undefined;


    const theme = config.theme || 'Default';
    const vertical = config.vertical;
    const round = config.round;
    const percent = percentComplete(hass, config);


    const borderRadius = styles[theme] ? styles[theme].borderRadius : styles['Default'].borderRadius;

    let cus_entity, cus_attr

    if (config.sensors){
        const cus_status = ThreedyCondition.Status in config.sensors ? config.sensors[ThreedyCondition.Status] : undefined;
        cus_entity = cus_status ? hass.states[cus_status['entity']] : undefined,
        cus_attr = cus_entity?.attributes[cus_status['attribute']] || undefined
    }
    const state = cus_attr || cus_entity?.state || (hass.states[config.use_mqtt ? `${config.base_entity}_print_status` : `${config.base_entity}_current_state`] || {state: 'unknown'}).state;

    const light_on = config.light_entity ? (hass.states[config.light_entity] || {state: 'off'}).state === 'on' : false;
    const power_on = config.power_entity ? (hass.states[config.power_entity] || {state: 'off'}).state === 'on' : false;

    const neumorphicShadow = hass.themes.darkMode ? '-5px -5px 8px rgba(50, 50, 50,.2),5px 5px 8px rgba(0,0,0,.08)' : '-4px -4px 8px rgba(255,255,255,.5),5px 5px 8px rgba(0,0,0,.03)'
    const defaultShadow = 'var( --ha-card-box-shadow, 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12) )'

    const hidden = state.toLowerCase() !== 'printing' && !hiddenOverride;
    const statusColor =
        state.toLowerCase() === 'printing' ?
            "#4caf50"
            : state.toLowerCase() === "unknown" ?
                "#f44336"
                : state.toLowerCase() === "operational" || state.toLowerCase() === "idle" ?
                    "#00bcd4"
                    : "#ffc107"

    return (
        <motion.div
            animate={{ borderRadius: hidden ? borderRadius : borderRadius * 2 }}
            transition={{ ease: "easeInOut", duration: 0.25 }}
            style={{
                ...styles.Card,
                ...styles[theme],
                fontFamily: config.font || 'sans-serif',
                boxShadow: theme === 'Neumorphic' ? neumorphicShadow : defaultShadow
            }}
        >
            <div style={{ ...styles.Root }}>

                <div
                    style={{
                        ...styles.Header,
                        justifyContent: config.power_entity || config.light_entity ? 'space-between' : 'center'
                    }}
                >

                    {
                        config.light_entity && !config.power_entity ? (
                            <div style={{ ...styles.PowerButton }} />
                        ) : (null)
                    }

                    {
                        config.power_entity ? (
                            <button
                                style={{ ...styles.PowerButton, color: power_on ? "var(--paper-item-icon-active-color)" : "var(--primary-text-color)" }}
                                onClick={() => toggleEntity(hass, config.power_entity)}
                            >
                                <IoPower />
                            </button>
                        ) : (null)
                    }

                    <button
                        style={{ ...styles.NameStatus }}
                        onClick={() => setHiddenOveride(!hiddenOverride)}
                    >
                        <div
                            style={{
                                ...styles.StatusDot,
                                backgroundColor: statusColor
                            }}
                        />
                        <p style={{ ...styles.HeaderText }}>{ config.name || '(no name)' }</p>
                    </button>

                    {
                        config.light_entity ? (
                            <button
                                style={{ ...styles.PowerButton, color: light_on ? "var(--paper-item-icon-active-color)" : "var(--primary-text-color)" }}
                                onClick={() => toggleEntity(hass, config.light_entity)}
                            >
                                {
                                    light_on ? <FaLightbulb /> : <FaRegLightbulb />
                                }
                            </button>
                        ) : (null)
                    }

                    {
                        config.power_entity && !config.light_entity ? (
                            <div style={{ ...styles.PowerButton }} />
                        ) : (null)
                    }

                </div>

                <motion.div
                    style={{ ...styles.Content, flexDirection: vertical ? 'column' : 'row', height: hidden ? 0.0 : 'auto', opacity: hidden ? 0.0 : 1, scale: hidden ? 0.0 : 1}}
                    animate={!config.always_show ? { height: hidden ? 0.0 : 'auto', opacity: hidden ? 0.0 : 1.0, scale: hidden ? 0.0 : 1.0 } : ''}
                    transition={!config.always_show ? { ease: "easeInOut", duration: 0.25 } : ''}
                >
                    <div style={{ ...styles.Section, width: vertical ? '100%' : '50%', height: vertical ? 'auto' : '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: vertical ? 64 : 16, paddingRight: vertical ? 64 : 16 }}>
                        <PrinterView
                            toggleVideo={toggleVideo}
                            hasCamera={config.camera_entity !== undefined}
                            style={{width: vertical ? 'auto' : '100%', flexGrow: 1}}
                        />
                        {
                            vertical ? (
                                <p style={{ width: '50%', fontSize: 36, textAlign: 'center', fontWeight: 'bold' }}>{round ? Math.round(percent) : percent}%</p>
                            ) : null
                        }
                    </div>
                    <div
                        style={{
                            ...styles.Section,
                            paddingLeft: vertical ? 32 : 16,
                            paddingRight: vertical ? 32 : 32,
                            width: vertical ? '100%' : '50%',
                            height: vertical ? 'auto' : '100%'
                        }}
                    >
                        <Stats showPercent={!vertical} />
                    </div>
                </motion.div>

            </div>

            {
                cameraEntity ? (
                    <Camera
                        visible={showVideo}
                        toggleVideo={() => setShowVideo(false)}
                        cameraEntity={cameraEntity}
                    />
                ) : (null)
            }

        </motion.div>
    )

}

export default Card;
