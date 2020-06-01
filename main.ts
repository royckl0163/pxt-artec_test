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

    /* spped initial value */
    let speedM1 = 255;
    let speedM2 = 255;
    let state = DCmotion.Brake;

    // Move DC motor
    //% blockId=artec_move_dc_motor
    //% block="DC motor %_connector| motion: %_motion| speed: %_speed"
    export function moveDCMotor(_connector: connectorDCMotor, _motion: DCmotion, _speed: number): void {

        
    }
} 