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

/**
 * ArtecRobo control package
 */
//% color=#5b99a5 weight=100 icon="\uf009" block="ArtecRobo_DC Motor"
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

    /* initial state */
    let state = DCmotion.Brake;

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

    I2C_value_1st = command_Brake_M1
    I2C_send()
    I2C_value_1st = command_Brake_M2
    I2C_send()

    // Move DC motor
    //% blockId=artec_move_dc_motor
    //% block="DC motor %_connector| motion: %_motion"
    export function moveDCMotor(_connector: connectorDCMotor, _motion: DCmotion): void {
        if (_connector == connectorDCMotor.M1) {
            switch (_motion) {
                case DCmotion.Forward:
                    I2C_value_1st = command_CW_M1;
                    break;
                case DCmotion.Backward:
                    I2C_value_1st = command_CCW_M1;
                    break;
                case DCmotion.Brake:
                    I2C_value_1st = command_Brake_M1;
                    setSpeedDCMotor(connectorDCMotor.M1, 0);
                    break;
                case DCmotion.Coast:
                    I2C_value_1st = command_Stop_M1;
                    setSpeedDCMotor(connectorDCMotor.M1, 0)
                    break;
            }
        }
        else if (_connector == connectorDCMotor.M2) {
            switch (_motion) {
                case DCmotion.Forward:
                    I2C_value_1st = command_CW_M2;
                    break;
                case DCmotion.Backward:
                    I2C_value_1st = command_CCW_M2;
                    break;
                case DCmotion.Brake:
                    I2C_value_1st = command_Brake_M2;
                    setSpeedDCMotor(connectorDCMotor.M2, 0)
                    break;
                case DCmotion.Coast:
                    I2C_value_1st = command_Stop_M2;
                    setSpeedDCMotor(connectorDCMotor.M2, 0)
                    break;
            }
        }
        I2C_send()
        state = _motion;
    }


    //% blockId=artec_set_speed_dc_motor
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
} 