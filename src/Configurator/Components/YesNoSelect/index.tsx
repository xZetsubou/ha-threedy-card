import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

import styles from './styles';

type OptionProps = {
    onClick: () => void;
}

const Option: React.FC<OptionProps> = ({ onClick, children }) => {

    const [active, setActive] = useState(false);

    const ref = useRef();

    const mouseDown = () => setActive(true);
    const mouseUp = () => setActive(false);

    return (
        <motion.button
            ref={ref}
            style={{ ...styles.Option }}
            animate={{
                filter: active ? 'brightness(80%)' : 'brightness(100%)'
            }}
            onClick={onClick}
            onMouseDown={mouseDown}
            onMouseUp={mouseUp}
            onMouseLeave={mouseUp}
        >
            { children }
        </motion.button>
    )

};

type YesNoSelectProps = {
    placeholder: string;
    initial: string;
    onSelect: (s: any) => void;
}

const YesNoSelect: React.FC<YesNoSelectProps> = ({ placeholder, initial, onSelect = (s) => { } }) => {

    const [selection, setSelection] = useState(initial);
    const [hidden, setHidden] = useState(true);
    const [active, setActive] = useState(false);
    const options = [
        {key: "Yes", value: true},
        {key: "No", value: false}
    ];

    const selectRef = useRef();
    const optionsRef = useRef();

    const showOptions = () => {
        setHidden(false);
    }

    const hideOptions = () => {
        setHidden(true);
    }

    const selectOption = (option) => {
        setSelection(option.key);
        onSelect(option.value)
        hideOptions();
    }

    return (
        <div style={{ ...styles.Select }}>

            <motion.button
                ref={selectRef}
                animate={{
                    backgroundColor: active ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.05)'
                }}
                transition={{
                    duration: 0.15,
                    ease: 'easeInOut'
                }}
                style={{
                    ...styles.SelectButton,
                }}
                onClick={showOptions}
                onMouseEnter={() => setActive(true)}
                onMouseLeave={() => setActive(false)}
            >
                {selection ? selection : placeholder}
                <FiChevronDown />
            </motion.button>

            <motion.div
                ref={optionsRef}
                animate={{
                    opacity: hidden ? 0.0 : 1.0,
                    scaleY: hidden ? 0.0 : 1.0
                }}
                transition={{
                    duration: 0.15,
                    ease: 'easeInOut'
                }}
                style={{ ...styles.Options }}
            >
                {
                    options.map((option) => (
                        <Option onClick={() => selectOption(option)}>
                            { option.key }
                        </Option>
                    ))
                }
            </motion.div>

        </div>
    )

}

export default YesNoSelect;
