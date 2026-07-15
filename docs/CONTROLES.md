Vamos con el PASO 2: fabricar tus propios controles de votación para conectarlos a tu sistema. Esto es muy interesante porque te permite tener tu propio hardware y no depender de equipos caros. Además, podrás conectarlos fácilmente a Node.js.

Te lo explicaré como si estuvieras montando el prototipo real del negocio.

1. Cómo será el control de votación
La idea es fabricar un pequeño dispositivo con botones que envíe el voto por WiFi al servidor.

Funcionará así:
```
Persona presiona botón
        ↓
Control envía voto por WiFi
        ↓
Servidor Node.js recibe voto
        ↓
Sistema guarda el voto
        ↓
Pantalla muestra resultados
```
Cada control tendrá:
* un ID único
* botones para votar

Ejemplo de botones:
* SI
* NO
* ABSTENCION

2. Hardware que vamos a usar
El microcontrolador ideal es:
ESP32 DevKit V1

Porque tiene:
* WiFi integrado
* es barato
* fácil de programar
* compatible con Arduino

1. Primero: ¿Qué significa RF?
RF = Radio Frequency (Radiofrecuencia).

Es simplemente una señal inalámbrica como:
crea
* WiFi
* Bluetooth
* controles de garaje
* controles de drones

Los controles de votación envían un **paquete de datos por radio al receptor**.

Ese paquete normalmente contiene:
* ID del control
* Botón presionado

Ejemplo:
* Control 52
* Voto = SI

La señal llega a un receptor USB conectado al computador.

2. Cómo funciona el sistema completo

Arquitectura real:
```
Control (RF)
     ↓
Receptor USB
     ↓
Software en el computador
     ↓
Resultados en pantalla
```
Los controles usan radio 2.4 GHz y pueden enviar votos hasta unos 60-120 metros


2. Crear tus propios controles RF (muy barato)

Esto es lo que hacen muchas startups.

## Tecnología:
* Arduino
* ESP32
* módulo RF

Componentes:
* botón
* batería
* módulo radio

Ejemplo hardware
### Control:
```
Botón
↓
Arduino
↓
RF transmitter
```
### Receptor:
```
RF receiver
↓
Arduino / ESP32
↓
USB
↓
Node.js
```
## Módulos RF populares
* nRF24L01
* LoRa
* 433MHz

Ejemplo flujo:
```
control 23
botón A
```

Arduino envía:
```
{device:23, vote:"A"}
```
Node recibe.

3. Si quieres controles baratos (recomendado)

Usa:
```
ESP32
+
botón
+
WiFi
```
Cada control envía HTTP.
```
POST /vote
{
device:25,
vote:"SI"
}
```
Eso es **muchísimo más fácil que RF**.


9. Costos si fabricas tus controles

Control DIY:

| Pieza | precio |
|---|---:|
| ESP32 | $4 |
| botones | $1 |
| batería | $3 |
| PCB | $2 |

Total:

👉 $10 por control

100 controles = $1.000

Mucho más barato que los comerciales.




## Componentes del control
| componente | cantidad | precio aprox |
|---|---|---:|
| ESP32 | 1 | $4 – $7 |
| botones | 3 | $1 |
| batería 18650 | 1 | $3 |
| cargador batería	| 1	| $1 |
| resistencias | 3 | $0.20 |
| caja plástica | 1 | $2 |

💰 Costo total aprox por control:
$8 – $12 USD

4. Conexión de los botones

Cada botón se conecta a un pin digital del ESP32.

Ejemplo:
```
Botón SI  → pin 18
Botón NO  → pin 19
Botón ABS → pin 21
```
Diagrama simple:
```
Botón
   ↓
GPIO
   ↓
ESP32
```

5. Cómo se conecta al servidor

El ESP32 se conecta al WiFi del evento.

Ejemplo:
```
Router
   ↓
Servidor Node
   ↓
ESP32 controles
```
Cada vez que alguien presione un botón el ESP32 enviará una petición HTTP.

Ejemplo:
```
POST http://servidor/votar
```
Datos enviados:
```
{
 "device_id": 103,
 "vote": "SI",
 "event": "asamblea2026",
 "timestamp": 123456
}
```

6. Código del ESP32 (ejemplo básico)

Este código envía el voto cuando presionan un botón.
```c++
#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "EVENTO_WIFI";
const char* password = "12345678";

int botonSi = 18;

void setup(){

    Serial.begin(115200);
    pinMode(botonSi, INPUT_PULLUP);

    WiFi.begin(ssid,password);

    while(WiFi.status()!=WL_CONNECTED){
        delay(500); 
    }

}

void loop(){
    if(digitalRead(botonSi)==LOW) {
        HTTPClient http;
        http.begin("http://192.168.1.10:3000/votar");
        http.addHeader("Content-Type","application/json");
        String data = "{\"device\":15,\"vote\":\"SI\"}";
        http.POST(data);
        http.end();
        delay(1000);
    }
}
```

7. Código Node.js para recibir votos

Servidor simple:
```js
const express = require("express")
const app = express()

app.use(express.json())

let votos = []

app.post("/votar",(req,res)=>{

    const {device,vote} = req.body

    votos.push({device,vote})

    console.log("VOTO:",device,vote)

    res.send("ok")

})

app.listen(3000,()=>{
    console.log("servidor activo")
})
```
Cuando alguien presione el botón verás en consola:
```
VOTO: 15 SI
```


8. Cómo identificar cada control

Cada dispositivo tendrá un ID único.

Puedes guardarlo en el código:

device_id = 15

O usar la MAC del ESP32.

9. Cómo manejar 300 controles

Esto es totalmente posible.

Arquitectura:
```
300 controles
     ↓
WiFi router potente
     ↓
Servidor Node
     ↓
pantalla resultados
```
Un router bueno puede manejar **500 conexiones sin problema**.

10. Costos reales para iniciar

Si fabricas 100 controles:

| item | costo |
|---|---:|
| ESP32 | $500 |
| baterías | $300 |
| botones | $100 |
| cajas | $200|

💰 Total aprox:
$1.100 USD (~4.5 millones COP)

Mucho más barato que sistemas comerciales.

-----------------
1️⃣ Cómo fabricar controles por menos de $5

El problema del ESP32 es que aunque es bueno, consume más energía y es más caro.

Para controles masivos es mejor usar:
* ESP8266 ESP‑01 WiFi Module

Este módulo cuesta entre $1.5 y $2 USD.

> Sí, el ESP32-C3 es el sucesor moderno del ESP8266, y aunque su precio es muy similar, ofrece mejoras significativas en rendimiento, capacidad y características. De hecho, por ese precio similar, se considera generalmente una opción mucho más capaz y recomendable para proyectos nuevos

Componentes del control barato

| componente	| precio aprox |
|---|---:|
| ESP8266 ESP-01 | $2 |
| botones | $0.50 |
| batería CR2032 | $0.40 |
| PCB | $0.80 |
| resistencias | $0.10 |

💰 Costo total aprox: $3.80 – $4.50 por control

Si fabricas 200 controles: ≈ $900 USD

⚠️ Cosas a tener en cuenta
Placas con gestión de batería: Existen placas de desarrollo como la **S**eeed Studio XIAO ESP32C3** que ya incluyen un circuito para cargar **baterías LiPo**, una opción mucho más práctica que usar baterías de botón .

# Cómo funciona el control
Cada control se conecta al WiFi del evento y envía el voto al servidor.

Arquitectura:
```
Control
 ↓
WiFi
 ↓
Router
 ↓
Servidor Node.js
 ↓
Base de datos
```

2️⃣ Cómo hacer que la batería dure meses o años

Esto es *muy importante* para tu negocio.
Los controles deben durar **toda la temporada de asambleas**.
El truco es usar **modo Deep Sleep**.
## Cómo funciona
El dispositivo está dormido casi todo el tiempo.
```
Dormido
 ↓
Persona presiona botón
 ↓
Se despierta
 ↓
Envía voto
 ↓
Vuelve a dormir
```
Consumo típico:

| estado | consumo | 
|---|---:|
| activo | 70 mA | 
| deep sleep | 20 µA | 

Con eso una batería puede durar 1 año o más.

## ¿Cómo se puede hacer entonces?
A pesar de esto, sí existen proyectos que usan el ESP32-C3 con baterías de botón. La clave está en *diseñar el software para que el chip esté casi siempre en un estado de muy bajo consumo* y despertarse solo cuando sea estrictamente necesario .

- **Modo Deep Sleep (Sueño Profundo)**: En este modo, el ESP32-C3 consume solo entre 5 µA y 44 µA . Con una CR2032 de 200 mAh, la duración en teoría sería de años .

- **Uso muy breve del WiFi**: Para enviar un dato, el ESP se despierta, se conecta a WiFi, transmite la información en milisegundos y vuelve a dormirse . Proyectos como sensores de temperatura consiguen una autonomía de más de un año con una batería más grande (18650), pero demuestra que la estrategia es válida .


3️⃣ Diseño de la carcasa profesional

Los prototipos se hacen con protoboard, pero el producto final debe verse profesional.

Un control profesional debe tener:
* carcasa plástica
* 3 botones grandes
* LED indicador
* ID del control

Ejemplo de botones:
```
[ SI ]   verde
[ NO ]   rojo
[ ABS ]  amarillo
````

### Cómo fabricar la carcasa

Opciones:
- impresión 3D

muy barato para comenzar
Costo: $1 – $2 por caja

- molde de inyección

para producción grande

Costo inicial: $1000 – $3000 pero luego cada caja cuesta: $0.30

4️⃣ Cómo evitar votos duplicados
Este punto es crítico para asambleas legales.

Debes evitar:
* que una persona vote dos veces
* que un control sea usado varias veces
* manipulación

- Solución 1 — ID único

Cada control tiene un identificador.
Ejemplo:
```
{
 "device_id": 103,
 "vote": "SI"
}
```
El servidor registra:
```
device 103 → voto SI
```
Si intenta votar otra vez:
```
rechazado
````

Solución 2 — Token de sesión

Antes de votar, el sistema activa los controles.

Ejemplo:
```
evento: asamblea_2026
```
Cada voto debe incluir ese token.

Solución 3 — Ventana de votación

El sistema solo acepta votos cuando la votación está abierta.

Ejemplo:
```
VOTACION ABIERTA
```
Luego:
```
VOTACION CERRADA
````

5️⃣ Arquitectura completa del sistema

Tu empresa podría usar este sistema:
```
CONTROLES
  ↓
WiFi Router
  ↓
Servidor Node.js
  ↓
Base de datos
  ↓
Pantalla resultados
````

El sistema muestra en vivo:
* porcentaje
* votos
* coeficientes


Mi arquitectura ideal

Aquí viene la parte interesante.

Yo NO haría esto:
```
500 controles
↓
1 Raspberry
```
Haría esto:
```
125 controles
↓
Gateway Raspberry 1

125 controles
↓
Gateway Raspberry 2

125 controles
↓
Gateway Raspberry 3

125 controles
↓
Gateway Raspberry 4
```
Luego:
```
Gateway
↓
MQTT
↓
Servidor Node
↓
Dashboard
````

Así, si un gateway falla, el resto continúa funcionando.

10.11 final consideraciones 
Yo no usaría una placa ESP32-C3 de desarrollo dentro del producto final.

Usaría directamente el chip o un módulo certificado basado en el ESP32-C3 sobre una PCB diseñada para ti.

Así el control podría ser aproximadamente:
```
7 mm de grosor
40 mm ancho
70 mm largo
25 gramos
````

Muchísimo más delgado que una placa de desarrollo.