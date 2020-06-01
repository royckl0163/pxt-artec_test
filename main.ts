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
//% color=#5b99a5 weight=100 icon="\uf009" block="ArtecRobo_test"
namespace artecrobo {

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

    // Move DC motor
    //% blockId=artec_move_dc_motor
    //% block="DC motor %_connector| motion: %_motion"
    export function moveDCMotor(_connector: connectorDCMotor, _motion: DCmotion): void {


    }

    // Move DC motor
    //% blockId=artec_move_dc_motor
    //% block="DC motor %_connector|  speed: %_speed"
    export function speedDCMotor(_connector: connectorDCMotor, _speed: number): void {


    }
} 