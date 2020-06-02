/**
 * Types of DC motor control
 */
enum DCmotion {
    //% block="Forward"
    Forward,
    //% block="Backward"
    Backward,
    //% block="Brake"
    Brake,
    //% block="Coast"
    Coast
}

enum connectorDCMotor {
    //% block="M1"
    M1,
    //% block="M2"
    M2
}

enum LEDmotion {
    //% block="ON"
    ON,
    //% block="OFF"
    OFF
}

enum connectorLED {
    //% block="P0"
    P0,
    //% block="P1"
    P1,
    //% block="P2"
    P2
}

enum connectorServoMotor {
    //% block="P13"
    P13 = AnalogPin.P13,
    //% block="P14"
    P14 = AnalogPin.P14,
    //% block="P15"
    P15 = AnalogPin.P15
}

enum tempUnit {
    //% block="C"
    C,
    //% block="F"
    F
}

/**
 * ArtecRobo control package
 */
//% color=#5b99a5 weight=100 icon="\uf009" block="ArtecRobo"
namespace artecrobo {

    function I2C_send() {
        I2C_buf = I2C_value_1st
        pins.i2cWriteNumber(
            62,
            I2C_buf,
            NumberFormat.Int8LE,
            true
        )
    }

    function I2C_send_2byte() {
        I2C_buf = I2C_value_1st * 256 + I2C_value_2nd
        pins.i2cWriteNumber(
            62,
            I2C_buf,
            NumberFormat.Int16BE,
            false
        )
    }

    let I2C_buf = 0
    let I2C_value_1st = 0
    let I2C_value_2nd = 0

    /* M1 I2C address */
    let command_CW_M1 = 0
    let command_CCW_M1 = 1
    let command_Stop_M1 = 2
    let command_Brake_M1 = 3
    let command_power_M1 = 4

    /* M2 I2C address */
    let command_CW_M2 = 8
    let command_CCW_M2 = 9
    let command_Stop_M2 = 10
    let command_Brake_M2 = 11
    let command_power_M2 = 12

    /* initial state */
    let state = DCmotion.Brake;
    I2C_value_1st = command_Brake_M1
    I2C_send()
    I2C_value_1st = command_Brake_M2
    I2C_send()

    // Move DC motor
    //% blockId=artec_move_dc_motor group="DC Motor (New board)"
    //% block="DC motor %_connector| motion: %_motion"
    export function moveDCMotor(_connector: connectorDCMotor, _motion: DCmotion): void {
        if (_connector == connectorDCMotor.M1) {
            switch (_motion) {
                case DCmotion.Forward:
                    I2C_value_1st = command_CW_M1
                    break
                case DCmotion.Backward:
                    I2C_value_1st = command_CCW_M1
                    break
                case DCmotion.Brake:
                    I2C_value_1st = command_Brake_M1
                    setSpeedDCMotor(connectorDCMotor.M1, 0)
                    break
                case DCmotion.Coast:
                    I2C_value_1st = command_Stop_M1
                    setSpeedDCMotor(connectorDCMotor.M1, 0)
                    break
            }
        }
        else if (_connector == connectorDCMotor.M2) {
            switch (_motion) {
                case DCmotion.Forward:
                    I2C_value_1st = command_CW_M2
                    break
                case DCmotion.Backward:
                    I2C_value_1st = command_CCW_M2
                    break
                case DCmotion.Brake:
                    I2C_value_1st = command_Brake_M2
                    setSpeedDCMotor(connectorDCMotor.M2, 0)
                    break
                case DCmotion.Coast:
                    I2C_value_1st = command_Stop_M2
                    setSpeedDCMotor(connectorDCMotor.M2, 0)
                    break
            }
        }
        I2C_send()
        state = _motion
    }

    //% blockId=artec_set_speed_dc_motor group="DC Motor (New board)"
    //% block="DC motor %_connector| speed: %_speed"
    //% _speed.min=0 _speed.max=255
    export function setSpeedDCMotor(_connector: connectorDCMotor, _speed: number): void {
        if (_speed < 0) { _speed = 0; }
        if (_speed > 255) { _speed = 255; }

        if (_connector == connectorDCMotor.M1)
            I2C_value_1st = command_power_M1;
        else if (_connector == connectorDCMotor.M2)
            I2C_value_1st = command_power_M2;

        if (state == DCmotion.Forward || state == DCmotion.Backward)
            I2C_value_2nd = _speed
        else
            I2C_value_2nd = 0

        I2C_send_2byte()
        basic.pause(20)
    }

    let angleP13 = 90;
    let angleP14 = 90;
    let angleP15 = 90;
    pins.servoWritePin(AnalogPin.P13, angleP13);
    pins.servoWritePin(AnalogPin.P14, angleP14);
    pins.servoWritePin(AnalogPin.P15, angleP15);

    //% blockId=artec_move_servo_motor_max group="Motor"
    //% block="move servo pin %_connector| to (degrees) %_angle"
    //% _angle.min=0 _angle.max=180
    export function moveServoMotorMax(_connector: connectorServoMotor, _angle: number): void {
        if (_angle < 0) { _angle = 0; }
        if (_angle > 180) { _angle = 180; }
        switch (_connector) {
            case connectorServoMotor.P13:
                pins.servoWritePin(AnalogPin.P13, _angle);
                angleP13 = _angle;
                break;
            case connectorServoMotor.P14:
                pins.servoWritePin(AnalogPin.P14, _angle);
                angleP14 = _angle;
                break;
            case connectorServoMotor.P15:
                pins.servoWritePin(AnalogPin.P15, _angle);
                angleP15 = _angle;
                break;
            default:
                break;
        }
    }

    //% blockId=artec_move_servo_motor group="Motor"
    //% block="move servo pin %_connector| to (degrees) %_angle| speed: %_speed"
    //% _angle.min=0 _angle.max=180
    //% _speed.min=0 _speed.max=20
    export function moveServoMotor(_connector: connectorServoMotor, _angle: number, _speed: number): void {
        if (_speed < 1) { _speed = 1; }
        if (_speed > 20) { _speed = 20; }
        if (_angle < 0) { _angle = 0; }
        if (_angle > 180) { _angle = 180; }
        switch (_connector) {
            case connectorServoMotor.P13:
                moveservo(AnalogPin.P13, angleP13, _angle, _speed);
                angleP13 = _angle;
                break;
            case connectorServoMotor.P14:
                moveservo(AnalogPin.P14, angleP14, _angle, _speed);
                angleP14 = _angle;
                break;
            case connectorServoMotor.P15:
                moveservo(AnalogPin.P15, angleP15, _angle, _speed);
                angleP15 = _angle;
                break;
            default:
                break;
        }
    }

    function moveservo(_pin: AnalogPin, _FromAngle: number, _ToAngle: number, _speed: number): void {
        const diff = Math.abs(_ToAngle - _FromAngle);
        if (diff == 0) return;

        const interval = Math.abs(_speed - 20) + 3;
        let dir = 1;
        if (_ToAngle - _FromAngle < 0) {
            dir = -1;
        }
        for (let i = 1; i <= diff; i++) {
            _FromAngle = _FromAngle + dir;
            pins.servoWritePin(_pin, _FromAngle);
            basic.pause(interval);
        }
    }

	/**
	 * Move Servo Motor Async.
	 * @param speed speed
	 * @param angle13 ServoMotor Angle P13
	 * @param angle14 ServoMotor Angle P14
	 * @param angle15 ServoMotor Angle P15
	 */
    //% weight=84 group="Motor"
    //% blockId=artec_async_move_servo_motor
    //% block="move servo synchronously | speed: %_speed| P13 (degrees): %_angle13| P14 (degrees): %_angle14 |P15 (degrees): %_angle15"
    //% _speed.min=1 _speed.max=20
    //% _angle13.min=0 _angle13.max=180
    //% _angle14.min=0 _angle14.max=180
    //% _angle15.min=0 _angle15.max=180
    export function AsyncMoveServoMotor(_speed: number, _angle13: number, _angle14: number, _angle15: number): void {
        if (_speed < 0) { _speed = 0; }
        if (_speed > 20) { _speed = 20; }
        if (_angle13 < 0) { _angle13 = 0; }
        if (_angle13 > 180) { _angle13 = 180; }
        if (_angle14 < 0) { _angle14 = 0; }
        if (_angle14 > 180) { _angle14 = 180; }
        if (_angle15 < 0) { _angle15 = 0; }
        if (_angle15 > 180) { _angle15 = 180; }
        const interval = Math.abs(_speed - 20) + 3;
        // サーボモーターを動かす方向
        let dirP13 = 1;
        if (_angle13 - angleP13 < 0) {
            dirP13 = -1;
        }

        let dirP14 = 1;
        if (_angle14 - angleP14 < 0) {
            dirP14 = -1;
        }

        let dirP15 = 1;
        if (_angle15 - angleP15 < 0) {
            dirP15 = -1;
        }

        const diffP13 = Math.abs(angleP13 - _angle13);    // 変化量
        const diffP14 = Math.abs(angleP14 - _angle14);    // 変化量
        const diffP15 = Math.abs(angleP15 - _angle15);    // 変化量
        let maxData = Math.max(diffP13, diffP14);
        maxData = Math.max(maxData, diffP15);

        let divideP13 = 0;
        if (diffP13 != 0) {
            divideP13 = maxData / diffP13;  // 1度変化させる間隔
        }

        let divideP14 = 0;
        if (diffP14 != 0) {
            divideP14 = maxData / diffP14;  // 1度変化させる間隔
        }

        let divideP15 = 0;
        if (diffP15 != 0) {
            divideP15 = maxData / diffP15;  // 1度変化させる間隔
        }

        for (let i = 1; i <= maxData; i++) {
            if (diffP13 != 0) {
                if (i % divideP13 == 0) {
                    angleP13 = angleP13 + dirP13;
                    pins.servoWritePin(AnalogPin.P13, angleP13);
                }
            }
            if (diffP14 != 0) {
                if (i % divideP14 == 0) {
                    angleP14 = angleP14 + dirP14;
                    pins.servoWritePin(AnalogPin.P14, angleP14);
                }
            }
            if (diffP15 != 0) {
                if (i % divideP15 == 0) {
                    angleP15 = angleP15 + dirP15;
                    pins.servoWritePin(AnalogPin.P15, angleP15);
                }
            }
            basic.pause(interval);
        }
        // 最後に全部そろえる。
        angleP13 = _angle13;
        angleP14 = _angle14;
        angleP15 = _angle15;
        if (diffP13 != 0) pins.servoWritePin(AnalogPin.P13, angleP13);
        if (diffP14 != 0) pins.servoWritePin(AnalogPin.P14, angleP14);
        if (diffP15 != 0) pins.servoWritePin(AnalogPin.P15, angleP15);
    }

    // Turn LED 
    //% blockId=artec_turn_led group="Sensor"
    //% block="turn LED %_connector|: %_motion"
    export function turnLED(_connector: connectorLED, _motion: LEDmotion): void {
        switch (_motion) {
            case LEDmotion.ON:
                if (_connector == connectorLED.P0) {
                    pins.digitalWritePin(DigitalPin.P0, 1);
                } else if (_connector == connectorLED.P1) {
                    pins.digitalWritePin(DigitalPin.P1, 1);
                } else {
                    pins.digitalWritePin(DigitalPin.P2, 1);
                }
                break;
            case LEDmotion.OFF:
                if (_connector == connectorLED.P0) {
                    pins.digitalWritePin(DigitalPin.P0, 0);
                } else if (_connector == connectorLED.P1) {
                    pins.digitalWritePin(DigitalPin.P1, 0);
                } else {
                    pins.digitalWritePin(DigitalPin.P2, 0);
                }
                break;
        }
    }

	/**
     * Measure the sound level as a number between 0 and 100
     * @param pin The pin that the mic is attached to.
     */
    //% block="sound level %pin" group="Sensor"
    export function soundLevel(pin: AnalogPin): number {
        let max_reading = 28;
        let value = Math.round(Math.sqrt(pins.analogReadPin(pin))); // to compensate for inverse square indoor lack of sensitivity
        let sound_level = Math.round(pins.map(value, 3, max_reading, 0, 100));
        if (sound_level > 100) {
            sound_level = 100;
        }
        return sound_level;
    }

    /**
     * Measure the temperature in degrees C or F
     * @param pin The pin that the temerature sensor is attached to.
     */
    //% block="temperature value %_pin | unit: %_tempUnit" group="Sensor"
    //% blockId=artec_temp_level_value
    export function tempLevel(pin: AnalogPin, _tempUnit: tempUnit): number {
        let temp_level = pins.analogReadPin(pin) / 10
        if (_tempUnit == tempUnit.C)
            return Math.round(temp_level);
        else if (_tempUnit == tempUnit.F)
            return Math.round(temp_level * 1.8 + 32);

        return temp_level;
    }

    /**
     * Measure the light level as a number between 0 and 100
     * @param pin The pin that the light sensor is attached to.
     */
    //% block="light level %pin"
    //% blockId=artec_light_level_value group="Sensor"
    export function lightLevel(pin: AnalogPin): number {
        let max_reading = 32;
        let value = Math.round(Math.sqrt(pins.analogReadPin(pin))); // to compensate for inverse square indoor lack of sensitivity
        let light_level = Math.round(pins.map(value, 6, max_reading, 0, 100));
        if (light_level > 100) {
            light_level = 100;
        }
        return light_level;
    }

	/**
     * Measure the IR Photoreflector level as a number between 0 and 1 for Line Tracking
     * @param pin The pin that the IR Photoreflector is attached to.
     */
    //% block="IR level %pin" group="Sensor"
    export function InfraredPhotoreflector(pin: AnalogPin): number {
        let max_reading = 28;
        let value = Math.sqrt(pins.analogReadPin(pin)); // to compensate for inverse square indoor lack of sensitivity
        let IR_level = Math.round(pins.map(value, 6, max_reading, 0, 100));
        if (IR_level > 100) {
            IR_level = 0;
        }
        else {
            IR_level = 1;
        }
        return IR_level;
    }

    export enum SonarVersion {
        V1 = 0x1,
        V2 = 0x2
    }
    let distanceBuf = 0;

	/**
     * Measure the ultrasonic level as a number 
     * @param pin The pin that the ultrasonic is attached to.
     */
    //% blockId=robotbit_ultrasonic block="Ultrasonic(CM)|pin %pin"
    //% weight=10
    export function Ultrasonic(pin: DigitalPin): number {
        pins.setPull(pin, PinPullMode.PullNone);
        pins.digitalWritePin(pin, 0);
        control.waitMicros(2);
        pins.digitalWritePin(pin, 1);
        control.waitMicros(10);
        pins.digitalWritePin(pin, 0);
        // read pulse
        let d = pins.pulseIn(pin, PulseValue.High, 25000);
        let ret = d;
        // filter timeout spikes
        if (ret == 0 && distanceBuf != 0) {
            ret = distanceBuf;
        }
        distanceBuf = d;
        return Math.floor(ret * 9 / 6 / 58);
        // Correction
    }
} 