export const metadata = {
  title: 'Política de Privacidad — Ras Store',
  description: 'Cómo recopilamos, usamos y protegemos tu información personal en Ras Store.',
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-semibold tracking-[0.2em] text-accent/60 uppercase mb-3">Legal</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Política de <span className="text-accent">Privacidad</span>
          </h1>
          <p className="text-white/40 text-sm">Última actualización: junio de 2025</p>
        </div>

        <div className="prose-custom space-y-10">

          <Section title="1. Quiénes somos">
            <p>
              Ras Store (en adelante "nosotros", "la Tienda" o "rasstore007.com") es una tienda en línea
              dedicada a la venta de productos artísticos, servicios creativos y logística cultural.
              Este documento describe cómo recopilamos, usamos, almacenamos y protegemos tu información
              personal cuando interactúas con nuestra plataforma.
            </p>
          </Section>

          <Section title="2. Información que recopilamos">
            <p>Recopilamos los siguientes tipos de datos:</p>
            <ul>
              <li><strong>Datos de registro:</strong> nombre, dirección de correo electrónico y contraseña cuando creas una cuenta.</li>
              <li><strong>Datos de compra:</strong> dirección de envío, historial de pedidos e información de pago procesada por terceros (Stripe, PayPal). No almacenamos datos de tarjetas de crédito en nuestros servidores.</li>
              <li><strong>Datos de uso:</strong> páginas visitadas, productos visualizados y acciones realizadas dentro de la tienda.</li>
              <li><strong>Datos técnicos:</strong> dirección IP, tipo de navegador y sistema operativo, con fines de seguridad y mejora del servicio.</li>
            </ul>
          </Section>

          <Section title="3. Cómo usamos tu información">
            <p>Utilizamos tus datos para:</p>
            <ul>
              <li>Procesar y gestionar tus pedidos y pagos.</li>
              <li>Enviar confirmaciones de compra y actualizaciones sobre el estado de tu pedido.</li>
              <li>Administrar tu membresía y acceso a contenido exclusivo.</li>
              <li>Mejorar la experiencia de navegación y el catálogo de productos.</li>
              <li>Cumplir con obligaciones legales y prevenir fraudes.</li>
            </ul>
            <p>No vendemos, alquilamos ni compartimos tu información personal con terceros con fines comerciales.</p>
          </Section>

          <Section title="4. Pagos y terceros">
            <p>
              Los pagos se procesan a través de <strong>Stripe</strong> y <strong>PayPal</strong>, plataformas
              certificadas con estándares PCI-DSS. Cuando realizas un pago, tu información financiera es
              gestionada directamente por estos proveedores bajo sus propias políticas de privacidad.
              Te recomendamos revisarlas en sus sitios oficiales.
            </p>
          </Section>

          <Section title="5. Cookies">
            <p>
              Usamos cookies estrictamente necesarias para mantener tu sesión iniciada y el estado de tu
              carrito. No utilizamos cookies de rastreo publicitario. Puedes deshabilitar las cookies
              desde la configuración de tu navegador, aunque esto puede afectar el funcionamiento de la tienda.
            </p>
          </Section>

          <Section title="6. Retención de datos">
            <p>
              Conservamos tu información mientras tu cuenta esté activa o sea necesaria para prestarte
              el servicio. Si solicitas la eliminación de tu cuenta, borraremos tus datos personales
              en un plazo de 30 días, salvo que la ley nos obligue a retenerlos por más tiempo.
            </p>
          </Section>

          <Section title="7. Tus derechos">
            <p>Tienes derecho a:</p>
            <ul>
              <li><strong>Acceder</strong> a los datos personales que tenemos sobre ti.</li>
              <li><strong>Corregir</strong> información inexacta o incompleta.</li>
              <li><strong>Solicitar la eliminación</strong> de tu cuenta y datos asociados.</li>
              <li><strong>Oponerte</strong> al tratamiento de tus datos en ciertos casos.</li>
            </ul>
            <p>Para ejercer cualquiera de estos derechos, escríbenos a <span className="text-accent">contacto@rasstore007.com</span>.</p>
          </Section>

          <Section title="8. Seguridad">
            <p>
              Implementamos medidas técnicas y organizativas para proteger tu información contra
              accesos no autorizados, alteración, divulgación o destrucción. Todas las comunicaciones
              con nuestra plataforma se realizan a través de HTTPS con certificado SSL.
            </p>
          </Section>

          <Section title="9. Cambios a esta política">
            <p>
              Podemos actualizar esta política en cualquier momento. Cuando lo hagamos, modificaremos
              la fecha de "última actualización" en la parte superior. Te notificaremos por correo
              electrónico si los cambios son significativos.
            </p>
          </Section>

          <Section title="10. Contacto">
            <p>
              Si tienes preguntas sobre esta política o sobre el manejo de tus datos, contáctanos en:
            </p>
            <div className="mt-3 p-4 bg-white/5 rounded-md border border-white/10 text-sm text-white/60 space-y-1">
              <p><strong className="text-white/80">Ras Store</strong></p>
              <p>rasstore007.com</p>
              <p>contacto@rasstore007.com</p>
            </div>
          </Section>

        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-lg font-bold text-white mb-3 pb-2 border-b border-white/10">
        {title}
      </h2>
      <div className="text-white/60 text-sm leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_strong]:text-white/80">
        {children}
      </div>
    </div>
  )
}
