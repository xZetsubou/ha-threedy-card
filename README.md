# threedy
## Home Asssistant card for Any 3D printers


![Featured](https://github.com/xZetsubou/ha-threedy-card/raw/master/screenshots/active.png)

# Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  * [Method 1: HACS](#method-1--hacs)
  * [Method 2: Manual](#method-2--manual)
- [Config](#config)
  * [Graphical](#graphical)
  * [Manual](#manual)
    + [Required](#required)
    + [Optional](#optional)
- [Examples](#examples)
- [Screenshots](#screenshots)
  * [Active Print](#active-print)
  * [Idle](#idle)
  * [Printer Offline](#printer-offline)
  * [Show/Hide Animation](#show-hide-animation)

## Features
---

- Live animation of 3D printer
- Live camera view
- Current states of various OctoPrint sensors
- Tap to show/hide when printer is idle
- Power button for a switch entity
- Light button for a switch entity
- Adjustable 3D printer graphic scale
- Themes


## Prerequisites
---
- [Home Assistant](https://www.home-assistant.io/) instance
- Expose the required data to homeassistant.



<details>
  <summary>Installation</summary>

## Installation
---
### Method 1: HACS
1. Open _HACS_ and navigate to _Frontend_ Section
2. Open the Overflow Menu (⋮) in the top right corner and click on _Custom repositories_
3. Paste `https://github.com/xZetsubou/ha-threedy-card` into the input field and select `Lovelace` from the dropdown
4. Click the Install Button on the highlighted Card titled _threedy_

### Method 2: Manual

1. Download ```threedy-card.js``` from the releases section.
2. Either:
  * Move to the ```www``` folder of your Home Assistant instance
  * Or copy the ffle's contents via the file editor.
3. In the Resources section of Lovelace (```Configuration -> Lovelace Dashboards -> Resources```), add ```/local/threedy-card.js``` as a ```JavaScript Module```.
4. Save
5. Add a manual card to your lovelace dashboard using the configuration instructions below.
6. Restart Server management
7. Reload Browser
</details>

## Config
---

<details>
  <summary>Card Config UI (Don't have all the features yet)</summary>

### Graphical

![graphical](https://github.com/xZetsubou/ha-threedy-card/raw/master/screenshots/graphical.png)
</details>

### Manual

#### Required

- ```type``` &mdash; Always ```'custom:threedy-card'```
- ```base_entity``` &mdash; `not needed if gonna reconfig ALL sensors` Take the beginning of one of the OctoPrint sensors of your printer. Example: for ```sensor.ender_3_v2_current_state``` it would be ```sensor_ender_3_v2```.
- ```name``` &mdash; Can be whatever you want!
- ```printer_type``` &mdash; Use a  printer style: ```'I3' | 'Cantilever' ```
- ```monitored``` &mdash; A list of values to monitor throughout the print; gets displayed to the right of the printer.

#### Optional

- ```theme``` &mdash; Theme of the card: ```'Default' | 'Neumorphic' ```. Screenshots listed below.
- ```font``` &mdash; Specify the font used in the card. By default it is ```sans-serif```.
- ```scale``` &mdash; The scale factor of the animated 3D printer view. Try different values until you find one you like.
- ```round_time``` &mdash; Specify whether to round durations of time. Defaults to false. ```true | false```
- ```round_temperature``` &mdash; Specify whether to round decimal numbers for temperatures. Defaults to false. ```true | false```
- ```temperature_unit``` &mdash; Specify which unit of temperature measurement to convert to. ```'F' | 'C' ```
- ```use_24hr``` &mdash; Use 24 hour time format instead of 12 hour.
- ```use_mqtt``` &mdash; Use [MQTT integration](https://plugins.octoprint.org/plugins/homeassistant/) instead of OctoPrint API.
- ```printer_config``` &mdash; Use in with ```printer_type``` to set a custom printer style. If omitted, the default for the type will be used. Use [this tool](https://google.com) to create a custom value.
- ```camera_entity``` &mdash; Specify the entity ID of the camera entity you want to display **when the printer graphic is clicked**.
- ```light_entity``` &mdash; Specify the entity ID of a light you want to toggle for the printer.
- ```power_entity``` &mdash; Specify the entity ID of a power switch you want to toggle for the printer.
- ```always_show``` &mdash; Override the auto collapse of the card. Precedes checking `states_show`.
- ```camera_rotate``` &mdash; Rotate camera 180deg. ``default: false``
- ```camera_mirror``` &mdash; Mirror camera. ``default: false``
- ```sensors``` &mdash; Override any sensor rather then depend on base_entity by sepcify Sensor property > `name`, `entity` and `attribute`.
- ```states_show``` &mdash; Provide list of states according to which the card must be shown. Precedes checking `states_hide`.
- ```states_hide``` &mdash; Provide list of states according to which the card must be hidden. Precedes default behavior (checking whether state is equal to `printing`).
  > Main Sensors options: ``Progress, Status, ETA, Elapsed, Remaining, Hotend and Bed``
  
  > You can add new custom sensor if you want ex
  > ``` yaml ex
  > monitored:
  >   - FileName
  > sensros:
  >   FileName:
  >     name: FileName
  >     entity: sensor.octoprint_print_file
  > ```

  > Customize sensors should allow you to run the card for moonraker etc...

## Examples

<details>
  <summary>Example Sensors w/ override Sensors</summary>
  
---
```yaml
# << configs
# Rather then specify 'base_entity' you can config each sensor.
type: 'custom:threedy-card'
base_entity: '' # You can use it if you want to override some of sensors and let some use base_etntity
name: 'Ender 3 Pro'
printer_type: I3
always_show: true
monitored:
  - Status
  - ETA
  - Elapsed
  - Remaining
  - Hotend
  - Bed
sensors:
  Progress: # return the print progress | 0 - 100
    entity: sensor.octoprint_print_progress 
  Elapsed: # return how much time have been since print starts - Require Status to be defined | number
    entity: sensor.octoprint_print_progress
    attribute: printTime 
  Remaining: # return how much time left to finish print - Require Status to be defined | number
    entity: sensor.octoprint_print_progress
    attribute: printTimeLeft
    name: Rem
  ETA: # return how much time left to finish print - Require Status to be defined | number
    entity: sensor.octoprint_print_progress
    attribute: printTimeLeft 
  Status: # return the state of printer | ( printing, stopped etc.. ) 
    entity: sensor.octoprint_print_status
  Hotend: # Return the temperature of hotend | number
    entity: sensor.octoprint_tool_0_temperature
  Bed: # Return the temperature of Bed | number
    entity: sensor.octoprint_bed_temperature
```
</details>

<details>
  <summary>Moonraker Example</summary>
  
---
```yaml
# Rather then specify 'base_entity' you can config each sensor.
type: 'custom:threedy-card'
base_entity: '' # You can use it if you want to override some of sensors and let some use base_etntity
name: 'Ender 3 Pro'
printer_type: I3
camera_entity: camera.ender_3_pro_camera
power_entity: switch.ender3pro_plug
light_entity: light.ender3_printer
monitored: # by the order you want.
  - Status
  - FileName
  - ETA
  - Elapsed
  - Remaining
  - Hotend
  - Bed
states_show:
  - printing
  - idle
states_hide:
  - unavailable
  - unknown
sensors:
  Progress: # return the print progress | 0 - 100
    entity: sensor.ender_3_pro_plus_progress 
  Status: # return the state of printer | ( printing, stopped etc.. ) 
    entity: sensor.ender_3_pro_current_print_state
  Elapsed: # return how much time have been since print starts - Require Status to be defined | number
    entity: sensor.eender_3_pro_print_duration
  Remaining: # return how much time left to finish print - Require Status to be defined | number
    entity: sensor.ender_3_pro_print_eta
  ETA: # return how much time left to finish print - Require Status to be defined | number
    entity: sensor.ender_3_pro_print_eta
  Hotend: # Return the temperature of hotend | number
    entity: sensor.ender_3_pro_extruder_temperature
  Bed: # Return the temperature of Bed | number
    entity: sensor.ender_3_pro_bed_temperature
  FileName:
    name: FileName
    entity: sensor.ender_3_pro_plus_filename
```
</details>

<details>
  <summary>Example Config</summary>

---
```yaml
# required
type: 'custom:threedy-card'
base_entity: 'sensor.ender_3_v2'
name: 'Ender 3 Pro'
printer_type: I3
monitored:
  - Status
  - ETA
  - Elapsed
  - Remaining
  - Hotend
  - Bed
# optionals  
theme: 'Default'
font: 'Roboto'
scale: 1.0
round: false 
always_show: true
```
</details>

<details>
  <summary>Custom Theming</summary>

---

Custom theming can be accomplished using [lovelace-card-mod](https://github.com/thomasloven/lovelace-card-mod#mod-card)'s ```mod-card```.
Some styles may require the css keyword ``` !important``` to override the inline style.
Example usage as follows:

```yaml
type: 'custom:mod-card'
style: |
  threedy-card > div {
    box-shadow: none !important;
  }
card:
  type: 'custom:threedy-card'
    .
    .
    .
    <card config>
```
</details>




## Screenshots
---

<details>
  <summary>Screenshot</summary>

### Active Print

![Active](https://github.com/xZetsubou/ha-threedy-card/raw/master/screenshots/active.png)

### Idle

![Idle](https://github.com/xZetsubou/ha-threedy-card/raw/master/screenshots/idle.png)

### Printer Offline

![Offline](https://github.com/xZetsubou/ha-threedy-card/raw/master/screenshots/offline.png)

### Show/Hide Animation

![ShowHide](https://media.giphy.com/media/14VgtFSulJkOaRiZFo/giphy.gif)

</details>
