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
    let speedM1 = 1023;
    let speedM2 = 1023;
    let state = DCmotion.Brake;

    // Move DC motor
    //% blockId=artec_move_dc_motor
    //% block="DC motor %_connector| motion: %_motion"
    export function moveDCMotor(_connector: connectorDCMotor, _motion: DCmotion): void {
        switch (_motion) {
            case DCmotion.Forward:
				/*
					Move Forward
					M1:P8 = speed, P12 = 0
					M2:P0 = speed, P16 = 0
				*/
                if (_connector == connectorDCMotor.M1) {
                    pins.digitalWritePin(DigitalPin.P8, 1);
                    pins.analogWritePin(AnalogPin.P12, speedM1);
                } else {
                    pins.digitalWritePin(DigitalPin.P0, 1);
                    pins.analogWritePin(AnalogPin.P16, speedM2);
                }
                break;
            case DCmotion.Backward:
				/*
					Move Backward
					M1:P8 = 0, P12 = speeed
					M2:P0 = 0, P16 = speeed
				*/
                if (_connector == connectorDCMotor.M1) {
                    pins.analogWritePin(AnalogPin.P8, speedM1);
                    pins.digitalWritePin(DigitalPin.P12, 1);
                } else {
                    pins.analogWritePin(AnalogPin.P0, speedM2);
                    pins.digitalWritePin(DigitalPin.P16, 1);
                }
                break;
            case DCmotion.Brake:
				/*
					Brake
					M1:P8 = 1, P12 = 1
					M2:P0 = 1, P16 = 1
				*/
                if (_connector == connectorDCMotor.M1) {
                    pins.digitalWritePin(DigitalPin.P8, 1);
                    pins.digitalWritePin(DigitalPin.P12, 1);
                } else {
                    pins.digitalWritePin(DigitalPin.P0, 1);
                    pins.digitalWritePin(DigitalPin.P16, 1);
                }
                break;
            case DCmotion.Coast:
				/*
					Coast
					M1:P8 = 0, P12 = 0
					M2:P0 = 0, P16 = 0
				*/
                if (_connector == connectorDCMotor.M1) {
                    pins.digitalWritePin(DigitalPin.P8, 0);
                    pins.digitalWritePin(DigitalPin.P12, 0);
                } else {
                    pins.digitalWritePin(DigitalPin.P0, 0);
                    pins.digitalWritePin(DigitalPin.P16, 0);
                }
                break;
        }
        state = _motion;
    }

    //% blockId=artec_set_speed_dc_motor
    //% block="DC motor %_connector| speed: %_speed"
    //% _speed.min=0 _speed.max=1023
    export function setSpeedDCMotor(_connector: connectorDCMotor, _speed: number): void {
        if (_speed < 0) { _speed = 0; }
        if (_speed > 1023) { _speed = 1023; }
        if (_connector == connectorDCMotor.M1) {
            speedM1 = 1023 - _speed;
        } else {
            speedM2 = 1023 - _speed;
        }
        if (state == DCmotion.Forward || state == DCmotion.Backward) {
            moveDCMotor(_connector, state);
        }
    }
} 