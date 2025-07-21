1) REVISAR Y ARREGLAR EL PDF DE EMPLEADOS
2) VER DE AL DESCUENTO UNITARIO SACARLE LAS FLECHAS(INPUT NUMÉRICO), QUE SEA DE PALABRAS
3) VER DE AGREGAR BOTÓN PARA SUMAR TEXTO EN EL PDF
4) ADATAR TODO AL RESTO DE COMPONENTES



================================
Pasos para realizar el launch
1) usar IIS, programa de la propia PC

ANTES DE CORRER EL COMANDO CAMBIAR TODAS LAS VARIABLES DE PUERTOS, BD, URLS, ETC.

2) correr el comando: dotnet publish BlumeAPI.csproj -c Release -o "G:\Desa\programa\Binarios\PublicadoBack" 
(PARA EL BACKEND)
3) configurar el IIS:

1. Configurar IIS para que acepte conexiones en esa IP
Abrí el Administrador de IIS.

Seleccioná tu sitio (BlumeAPI).

En el panel derecho, hacé clic en Enlaces...

Seleccioná el enlace para el puerto 8080 y hacé clic en Editar...

En Dirección IP, seleccioná Todas no asignadas (*) o directamente poné 192.168.1.40.

Confirmá con Aceptar.

2. Abrir el puerto 8080 en el Firewall de Windows
Abrí el Panel de Control → Sistema y Seguridad → Firewall de Windows Defender → Configuración avanzada.

En la ventana que se abre, seleccioná Reglas de entrada → Nueva regla...

Elegí Puerto → Siguiente.

Seleccioná TCP y especificá el puerto 8080 → Siguiente.

Elegí Permitir la conexión → Siguiente.

Aplicalo para los perfiles que correspondan (Dominio, Privado, Público) → Siguiente.

Poné un nombre, ejemplo: IIS puerto 8080 → Finalizar.



4) Correr el siguiente comando(FRONTEND): ng build --configuration production --output-path G:\Desa\programa\Binarios\PublicadoFront

5) Crear el web.config (no te lo crea por defecto) y modificarlo en la computadora receptora (no se pone el .config):
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Angular Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/index.html" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>

