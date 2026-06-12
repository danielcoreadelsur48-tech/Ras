export const metadata = {
  title: 'Términos y Condiciones — Ras Store',
  description: 'Condiciones de uso, compra y membresía de Ras Store.',
}

export default function TerminosPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-semibold tracking-[0.2em] text-accent/60 uppercase mb-3">Legal</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Términos y <span className="text-accent">Condiciones</span>
          </h1>
          <p className="text-white/40 text-sm">Última actualización: junio de 2025</p>
        </div>

        <div className="space-y-10">

          <Section title="1. Aceptación de los términos">
            <p>
              Al acceder y utilizar rasstore007.com (en adelante "la Tienda"), aceptas quedar vinculado
              por estos Términos y Condiciones. Si no estás de acuerdo con alguno de ellos, te pedimos
              que no utilices nuestra plataforma.
            </p>
          </Section>

          <Section title="2. Descripción del servicio">
            <p>
              Ras Store es una tienda en línea que ofrece productos artísticos, servicios creativos y
              logística cultural. Operamos un catálogo de arte visual, arte digital, impresiones,
              diseño gráfico y servicios de distribución. Parte de nuestro contenido y precios están
              disponibles exclusivamente para miembros suscritos.
            </p>
          </Section>

          <Section title="3. Cuentas de usuario">
            <p>
              Para realizar compras debes crear una cuenta con información veraz y actualizada.
              Eres responsable de mantener la confidencialidad de tu contraseña y de todas las
              actividades que ocurran bajo tu cuenta. Notifícanos de inmediato ante cualquier uso
              no autorizado a <span className="text-accent">contacto@rasstore007.com</span>.
            </p>
            <p>
              Nos reservamos el derecho de suspender o cancelar cuentas que violen estos términos,
              realicen actividades fraudulentas o proporcionen información falsa.
            </p>
          </Section>

          <Section title="4. Precios y pagos">
            <ul>
              <li>Todos los precios se muestran en la moneda indicada en cada producto e incluyen los impuestos aplicables.</li>
              <li>Los pagos se procesan a través de <strong>Stripe</strong> (tarjetas de crédito/débito) y <strong>PayPal</strong>.</li>
              <li>Una vez procesado el pago, recibirás una confirmación por correo electrónico. El pedido no se considera confirmado hasta que el pago sea verificado.</li>
              <li>Nos reservamos el derecho de cancelar pedidos por error de precio, fraude detectado o falta de stock.</li>
            </ul>
          </Section>

          <Section title="5. Envíos y entregas">
            <p>
              Los tiempos y costos de envío varían según el destino y el método seleccionado durante
              el proceso de compra. Una vez despachado tu pedido, recibirás un número de seguimiento.
              Ras Store no se responsabiliza por demoras causadas por la empresa de mensajería o por
              factores externos fuera de nuestro control (aduanas, fenómenos naturales, etc.).
            </p>
          </Section>

          <Section title="6. Política de devoluciones">
            <ul>
              <li><strong>Productos físicos:</strong> tienes 7 días hábiles desde la recepción para solicitar una devolución por defecto de fabricación o error en el pedido. El producto debe estar sin uso y en su empaque original.</li>
              <li><strong>Productos digitales:</strong> por su naturaleza, los productos digitales (descargas, arte digital) no son reembolsables una vez descargados.</li>
              <li><strong>Servicios creativos:</strong> los servicios contratados se rigen por el acuerdo específico entre las partes al momento de la contratación.</li>
            </ul>
            <p>Para iniciar una devolución, escríbenos a <span className="text-accent">contacto@rasstore007.com</span> con tu número de pedido.</p>
          </Section>

          <Section title="7. Club de Miembros">
            <p>
              Ras Store ofrece suscripciones de membresía que otorgan acceso a productos exclusivos,
              precios especiales y contenido restringido. Al suscribirte:
            </p>
            <ul>
              <li>Autorizas el cobro recurrente según el plan seleccionado.</li>
              <li>Puedes cancelar tu membresía en cualquier momento; el acceso se mantiene hasta el final del período pagado.</li>
              <li>No se realizan reembolsos parciales por períodos no consumidos, salvo error de nuestra parte.</li>
            </ul>
          </Section>

          <Section title="8. Propiedad intelectual">
            <p>
              Todo el contenido de Ras Store — incluyendo imágenes, textos, logotipos, diseños y
              código fuente — es propiedad de Ras Store o de sus respectivos autores y está protegido
              por las leyes de propiedad intelectual aplicables. Queda prohibida su reproducción,
              distribución o uso comercial sin autorización previa por escrito.
            </p>
            <p>
              Los artistas que venden a través de nuestra plataforma conservan los derechos de autor
              sobre sus obras. La compra de un producto físico o digital no transfiere derechos de
              reproducción comercial al comprador, salvo acuerdo expreso.
            </p>
          </Section>

          <Section title="9. Limitación de responsabilidad">
            <p>
              Ras Store no garantiza la disponibilidad ininterrumpida de la plataforma. No seremos
              responsables por daños indirectos, pérdida de datos, lucro cesante o daños consecuentes
              derivados del uso o imposibilidad de uso de nuestros servicios. Nuestra responsabilidad
              máxima ante cualquier reclamación se limita al monto pagado por el pedido en cuestión.
            </p>
          </Section>

          <Section title="10. Modificaciones">
            <p>
              Podemos modificar estos Términos en cualquier momento. Los cambios entran en vigor
              desde su publicación. El uso continuado de la plataforma tras la actualización implica
              la aceptación de los nuevos términos.
            </p>
          </Section>

          <Section title="11. Ley aplicable">
            <p>
              Estos Términos se rigen por las leyes vigentes en la jurisdicción donde opera Ras Store.
              Cualquier disputa que no pueda resolverse amigablemente será sometida a los tribunales
              competentes de dicha jurisdicción.
            </p>
          </Section>

          <Section title="12. Contacto">
            <p>Para cualquier consulta sobre estos términos:</p>
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
