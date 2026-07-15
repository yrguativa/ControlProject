# MicroPython firmware para controles de votacion

## Hardware requerido

- ESP32 DevKit V1 (o ESP32-C3)
- Botones x3 (SI, NO, ABSTENCION)
- LED indicador
- Bateria 18650 o LiPo

## Conexion de botones

```
Boton SI  -> GPIO 18 (INPUT_PULLUP)
Boton NO  -> GPIO 19 (INPUT_PULLUP)
Boton ABS -> GPIO 21 (INPUT_PULLUP)
LED       -> GPIO 2
```

## Flashear firmware

1. Instalar esptool:
   ```bash
   pip install esptool
   ```

2. Flashear MicroPython:
   ```bash
   esptool.py --port /dev/ttyUSB0 write_flash 0x0 firmware.bin
   ```

3. Subir archivos al ESP32:
   ```bash
   ampy --port /dev/ttyUSB0 put main.py
   ampy --port /dev/ttyUSB0 put config.py
   ```

4. Reiniciar el dispositivo.

## Configuracion

Editar `config.py` con:
- Credenciales WiFi del evento
- IP del servidor Node.js
- Pinos GPIO segun tu placa

## Protocolo de voto

El dispositivo envia un POST HTTP al servidor:
```json
{
  "device_id": "aa11bb22cc33",
  "vote": "SI",
  "timestamp": 1234567890
}
```

Opciones de voto: `SI`, `NO`, `ABSTENCION`

## Consumo de bateria

| Estado | Consumo |
|--------|---------|
| Activo | 70 mA |
| Deep sleep | 20 uA |

Con deep sleep, una bateria 18650 (3400mAh) dura ~1 ano.
