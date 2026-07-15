"""Configuracion del dispositivo IoT para controles de votacion.

Cada control tiene un DEVICE_ID unico (generado automaticamente desde
la MAC del ESP32). Los pines y credenciales WiFi se configuran aqui
antes de flashear.
"""

# --- WiFi ---
WIFI_SSID = "EVENTO_WIFI"
WIFI_PASS = "12345678"

# --- Servidor ---
SERVER_HOST = "192.168.1.10"
SERVER_PORT = 3000

# --- Pines GPIO (ESP32) ---
PIN_SI = 18
PIN_NO = 19
PIN_ABS = 21
PIN_LED = 2

# --- Deep sleep ---
SLEEP_SECONDS = 30
