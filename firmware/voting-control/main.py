"""Control de votacion - MicroPython para ESP32

Flujo:
  1. El dispositivo se conecta al WiFi del evento
  2. Espera a recibir un token de sesion via MQTT
  3. Cuando se presiona un boton, envia el voto al servidor
  4. Entra en deep sleep para ahorrar bateria

Hardware:
  - ESP32 (o ESP32-C3)
  - Boton SI  -> GPIO 18
  - Boton NO  -> GPIO 19
  - Boton ABS -> GPIO 21
  - LED indicador -> GPIO 2
"""

import network
import time
import json
import machine
from machine import Pin
import ubinascii

# --- Configuracion ---
WIFI_SSID = "EVENTO_WIFI"
WIFI_PASS = "12345678"
SERVER_HOST = "192.168.1.10"
SERVER_PORT = 3000
DEVICE_ID = ubinascii.hexlify(machine.unique_id()).decode()

# Pines de botones
PIN_SI = Pin(18, Pin.IN, Pin.PULL_UP)
PIN_NO = Pin(19, Pin.IN, Pin.PULL_UP)
PIN_ABS = Pin(21, Pin.IN, Pin.PULL_UP)
LED = Pin(2, Pin.OUT)


def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(WIFI_SSID, WIFI_PASS)

    timeout = 0
    while not wlan.isconnected() and timeout < 20:
        time.sleep(0.5)
        timeout += 1
        LED.toggle()

    if wlan.isconnected():
        print(f"WiFi conectado: {wlan.ifconfig()[0]}")
        LED.on()
        return True
    else:
        print("Error: no se pudo conectar al WiFi")
        LED.off()
        return False


def read_vote():
    if PIN_SI.value() == 0:
        return "SI"
    elif PIN_NO.value() == 0:
        return "NO"
    elif PIN_ABS.value() == 0:
        return "ABSTENCION"
    return None


def send_vote(vote_option):
    import usocket
    addr = usocket.getaddrinfo(SERVER_HOST, SERVER_PORT)[0][-1]
    s = usocket.socket()
    s.connect(addr)

    payload = json.dumps({
        "device_id": DEVICE_ID,
        "vote": vote_option,
        "timestamp": time.time(),
    })

    request = (
        f"POST /votar HTTP/1.1\r\n"
        f"Host: {SERVER_HOST}:{SERVER_PORT}\r\n"
        f"Content-Type: application/json\r\n"
        f"Content-Length: {len(payload)}\r\n"
        f"Connection: close\r\n"
        f"\r\n"
        f"{payload}"
    )

    s.send(request)
    response = s.recv(1024)
    s.close()
    print(f"Voto enviado: {vote_option} | Respuesta: {response[:50]}")


def enter_deep_sleep(seconds=30):
    print(f"Durmiendo {seconds}s...")
    machine.deepsleep(seconds * 1000)


def main():
    print(f"Device ID: {DEVICE_ID}")

    if not connect_wifi():
        enter_deep_sleep(10)
        return

    vote = read_vote()
    if vote:
        LED.blink(100)
        send_vote(vote)
        time.sleep(0.5)
    else:
        print("Sin boton presionado")

    enter_deep_sleep(30)


if __name__ == "__main__":
    main()
