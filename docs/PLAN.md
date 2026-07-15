
# Proyecto de controles de votación
## Justificacion 
Montar una empresa de votaciones electrónicas para asambleas de conjuntos residenciales en Colombia es una muy buena idea. Este mercado existe porque las asambleas de propiedad horizontal (Ley 675) necesitan registrar quórum, poderes, coeficientes y votaciones legales


## 1. Modelo de negocio de la empresa

Tu empresa ofrecería servicio tecnológico para asambleas.

Servicios que puedes vender:
* 1️⃣ Sistema de votación electrónica
* 2️⃣ Control de asistencia y quórum
* 3️⃣ Registro de poderes
* 4️⃣ Conteo automático de votos
* 5️⃣ Generación de actas y reportes
* 6️⃣ Asambleas híbridas (presencial + virtual)

Muchos sistemas modernos permiten votar por QR, web o app, sin controles físicos, aunque también existen sistemas con controles RF inalámbricos.

### 💰 Precio promedio en Colombia por evento:
| Tamaño conjunto | Precio |
|---|---:|
| 50 apartamentos | $600.000 – $1.000.000 |
| 100 apartamentos | $1.000.000 – $1.800.000 |
| 300 apartamentos | $2.000.000 – $4.000.000 |

Si haces 5 asambleas al mes podrías facturar:

👉 $5M – $10M mensuales.

## 2. Tipos de sistemas de votación que puedes usar
Hay 3 modelos principales.

### 1️⃣ Controles inalámbricos (tipo control remoto)
Muy usado en eventos.

Características:
* Cada persona tiene un control
* Vota: SI / NO / ABSTENCIÓN
* Funciona por radiofrecuencia
* Resultados en tiempo real

Ventaja:
* No depende de internet

Desventaja:
* Debes comprar muchos controles

Este sistema se conoce como **Audience Response System** y funciona con transmisión RF inalámbrica.

### 2️⃣ Votación por celular
Cada persona vota desde su celular.

Métodos:
* QR
* Web
* WhatsApp

Ventajas:
* Casi sin hardware
* Muy barato
* Escalable

Hoy muchas empresas usan este modelo.

### 3️⃣ Sistema híbrido

Combina:
* celular
* tablet
* controles

Es el mejor para asambleas grandes.

## 3. Equipos necesarios (hardware)
1️⃣ Controles de votación
Se llaman: Voting Keypads, Audience response clickers

Funciones:
* botón A / B / C
* enviar voto
* identificar usuario

💰 Precio:

$15 – $40 USD por control

Ejemplo:
100 controles → $1.500 USD ≈ $6.000.000 COP

2️⃣ Receptor RF
Recibe los votos.
Se conecta a:
* laptop
* servidor

💰 Precio
$80 – $300 USD

3️⃣ Laptop / servidor

Requisitos:

i5
16GB RAM
SSD

Costo:

$3M – $4M COP

4️⃣ Pantalla o proyector

Para mostrar resultados.

Costo:

$1.5M – $3M

Software necesario

Debes tener un sistema que haga:

- Registro de asistentes
Campos:
* nombre
* apartamento
* coeficiente
* poderes

- Control de quórum
Debe mostrar:
* total coeficientes
* presentes
* representados

- Módulo de votación
Opciones:
* SI
* NO
* ABSTENCIÓN
o
* elección de planchas

- Resultados en tiempo real
Mostrar:
* porcentaje
* coeficientes
* votos

- Generación automática de acta
Exportar:
* PDF
* Excel

6. Arquitectura del sistema

Flujo típico:
* 1️⃣ Registro asistentes
* 2️⃣ Asignar dispositivo
* 3️⃣ Abrir votación
* 4️⃣ Usuarios votan
* 5️⃣ Sistema calcula
* 6️⃣ Mostrar resultados

Arquitectura simple:
```
Controles / Celulares
      ↓
   Receptor
      ↓
   Laptop
      ↓
   Software
      ↓
Pantalla resultados
```
7. Equipos mínimos para iniciar

Starter kit:

| Equipo	| Cantidad	| Costo |
|---|---|---:|
| Controles	| 100	| $6M |
| Receptor RF | 1	| $500k |
| Laptop	| 1 | $3M |
| Router	| 1	| $300k |
| Software	| -	| $6M |
| Proyector | 1	| $2M |

Total inicial:

💰 $17M – $20M COP

9. Estructura legal en Colombia
Debes registrar:
Empresa SAS.

Actividad económica:
* desarrollo software
* servicios tecnológicos
* eventos corporativos

Registros:
1️⃣ Cámara de Comercio
2️⃣ RUT DIAN
3️⃣ Facturación electrónica

11. Diferenciación (clave del negocio)
Ofrece:

✔ grabación de asamblea
✔ acta automática
✔ votación híbrida
✔ control coeficiente automático

Esto es lo que hace que las asambleas tengan validez legal y control de quórum.

12. Escalabilidad del negocio
Si tienes:
- 3 equipos de votación
- 3 técnicos

Puedes hacer:
👉 10 a 20 asambleas por mes.

Ingresos posibles: 💰 $15M – $40M mensual.


7️⃣ Equipo mínimo para iniciar la empresa
equipo	costo
200 controles	$900
router potente	$200
laptop	$900
pantalla/proyector	$500

💰 inversión inicial aprox:
👉 $2500 – $3000 USD

En Colombia:

≈ 10 – 12 millones COP

8️⃣ Cuánto puedes cobrar

Ejemplo de mercado:

tamaño conjunto	precio
50 aptos	$600k
100 aptos	$1M
300 aptos	$2M

Si haces 10 asambleas en temporada:

💰 10M – 20M COP


9. Arquitectura con Raspberry Pu Zero 2 W

La idea sería esta:
```
Controles
   ↓
Raspberry Pi (receptor local)
   ↓
Servidor central / API Node.js
   ↓
Base de datos
   ↓
Pantalla de resultados
```
Cada Raspberry funcionaría como un nodo de recepción.


9.1 Cómo se conectarían los controles a la Raspberry

Tienes 2 formas posibles.

Opción A — WiFi directo a la Raspberry (modo Access Point)

La Raspberry crea su propia red WiFi.
```
ESP8266 controles
     ↓
WiFi Raspberry
     ↓
Procesamiento local
     ↓
API central
```
La Raspberry funciona como router pequeño + servidor.

En Linux se usa:
* hostapd
* dnsmasq

Flujo:
```
Control envía POST
↓
Raspberry recibe
↓
Valida voto
↓
Lo envía al servidor
````

Opción B — Radio RF + Raspberry

Los controles envían señal RF y la Raspberry recibe con un módulo.

Ejemplo:
* nRF24L01+ 2.4GHz RF Transceiver Module
* SX1278 LoRa Transceiver Module

Arquitectura:
```
Controles RF
   ↓
Módulo RF
   ↓
Raspberry
   ↓
API
````

Ventajas:
- ✔ no saturas WiFi.
- ✔ mejor batería
- ✔ alcance mayor

3. Cómo funcionaría el procesamiento en la Raspberry

La Raspberry puede ejecutar un pequeño servicio.

Ejemplo arquitectura:
```
Controles
   ↓
Raspberry listener
   ↓
Queue local
   ↓
API Node.js
````

La Raspberry puede:
* validar ID
* eliminar duplicados
* almacenar temporalmente votos

Esto evita que se pierdan votos si el internet falla.

9.2. Cuántos controles soporta una Raspberry

Una Raspberry Pi Zero 2 W puede manejar aprox:

| tipo conexión | dispositivos |
|---|---:|
| WiFi | 30-50 |
| RF | 200-500 |

Por eso muchas arquitecturas usan RF para los controles.

6. Arquitectura escalable para tu empresa

Si tuvieras una asamblea de 300 personas:
```
100 controles → Raspberry 1
100 controles → Raspberry 2
100 controles → Raspberry 3
````

Luego:
```
Raspberry nodes
      ↓
Servidor central Node.js
      ↓
Dashboard resultados
````

Esto es muy robusto.