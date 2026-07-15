# Ejemplo de arquitectura profesional

Una arquitectura robusta sería:
```
CONTROLES
     ↓
Raspberry nodos (RF/WiFi)
     ↓
MQTT broker
     ↓
API Node.js
     ↓
PostgreSQL
     ↓
Dashboard
````

Usando **MQTT** reduces latencia.

> Latencia: Debes mantener respuesta menor a: < 200 ms


Puedes usar:
- Mosquitto MQTT Broker

## Costos del sistema con Raspberry

equipo	precio
Raspberry Pi Zero 2 W	$15
módulo RF	$3
fuente	$3

Total por nodo: $20 USD
Con 4 nodos: ≈ $80 USD

Muy barato.

En votaciones grandes siempre se usa:
* procesamiento local
* servidor central

Tu idea de Raspberry va exactamente en esa dirección 👍

## Conclusión
Sí, es totalmente viable:

* controles → Raspberry nodes
* Raspberry procesa votos
* Raspberry envía al API

Es una arquitectura distribuida y profesional.

# Prototipo → producto
Tu flujo correcto sería:

- 1️⃣ Prototipo con ESP32
- 2️⃣ Validar sistema
- 3️⃣ Diseñar PCB
- 4️⃣ Fabricar controles compactos
- 5️⃣ Producción masiva

Esto es exactamente cómo nacen los productos electrónicos reales.

## 1. Arquitectura profesional para 1000 controles
Para sistemas grandes se usa arquitectura distribuida.
```
CONTROLES RF
     ↓
Receptores (Raspberry o gateway RF)
     ↓
MQTT Broker
     ↓
API Node.js
     ↓
Base de datos
     ↓
Pantalla resultados
````
### Componentes típicos:
* Controles RF
* Gateways (Raspberry)
* Broker MQTT
* API

Un sistema así puede manejar miles de votos en segundos.

## 2 Protocolo de comunicación de los controles
Los controles deben enviar paquetes pequeños.

Ejemplo de paquete:
```
{
     "device": 241,
     "vote": 1,
     "event": 33,
     "crc": 8472
}
````
Donde:

| campo	| significado
|---|---:|
| device	| ID del control
| vote	botón | presionado
| event	| votación actual
| crc	| verificación

El paquete completo puede ser **menos de 16 bytes**.

Eso hace el sistema **muy rápido**.

### Cómo evitar interferencias RF
En eventos grandes hay mucho ruido:
* WiFi
* Bluetooth
* celulares

Para evitar problemas se usan estas estrategias.

### saltos de canal (frequency hopping)
El receptor cambia frecuencias.

### ACK de recepción
El receptor confirma el voto.
```
control → voto
receptor → recibido
````
Si no recibe confirmación:
```
control reenvía
```
### tiempo aleatorio de envío

Los controles no transmiten al mismo tiempo.

## 4 Prototipo funcional en un fin de semana
Para probar la idea rápido usa:
* ESP32 DevKit V1
* nRF24L01+ 2.4GHz RF Transceiver Module

Arquitectura:
```
botón
↓
ESP32
↓
nRF24L01
↓
Raspberry
↓
Node.js
````
Material para prototipo:
| pieza	| precio
|---|---:|
| ESP32	| $5
| RF module	| $2
| botones	| $1

Con $8 haces un control prototipo.

## 5 ¿ Necesitas ESP32 si usas RF?
No necesariamente.
El sistema RF tiene dos partes:
* 1️⃣ microcontrolador: controla botones y lógica
* 2️⃣ transceptor RF: envía señal

El ESP32 integra:
* CPU
* WiFi
* Bluetooth

Pero **no es obligatorio**.

> Para un control delgado se usan chips más pequeños. producto final

Ejemplos comunes:

| chip | uso 
|---|---:|
| ATtiny85 | controles simples
| STM32C0	| dispositivos pequeños
| nRF52832	| RF + microcontrolador

Muchos controles comerciales usan chips de 3 mm.

## 6  Cómo hacer el control más delgado
Un control profesional usa:
* microcontrolador pequeño
* RF integrado
* batería botón

Ejemplo de batería:
* CR2032

Peso total: ≈ 15 gramos

Grosor: ≈ 6–8 mm
## 7  Cómo se pasa de Arduino a producto real
Aquí está el proceso que siguen las empresas.

### Etapa 1 — prototipo rápido
Usas:
* Arduino
* ESP32
* cables

Esto prueba que la idea funciona.
____________________
### Etapa 2 — prototipo de ingeniería
Se diseña un PCB propio.
Herramientas usadas:
* KiCad
* Altium Designer
____________________
### Etapa 3 — fabricación PCB
Empresas fabrican las placas.
Ejemplos:
* JLCPCB
* PCBWay

Costo: 5 placas prototipo ≈ $20
____________________
### Etapa 4 — ensamblaje
Se sueldan:
* chips
* botones
* resistencias

Esto puede hacerlo:
* fábrica
* técnico electrónico
____________________
### Etapa 5 — molde plástico
Para producción grande se crea un molde.

Costo: $1500 – $3000 Luego cada carcasa cuesta: $0.30

10.10 Costos reales de producción
Producción de 500 controles:

| componente	| costo
|---|---:|
| PCB	| $0.80
| chip	| $1.50
| botones	| $0.40
| batería	| $0.40
| carcasa	| $0.30

Costo total: ≈ $3.50 por control y 500 controles:≈ $1750