import type { Flayer } from '@/types'

const FLAYER_COLORS = ['201,162,39', '110,209,253', '214,64,122', '64,214,140']

export function FlayersSection({ flayers }: { flayers: Flayer[] }) {
  if (!flayers.length) return null

  const visible = flayers.slice(0, 4)

  return (
    <section className="py-12 px-4">
      <style>{`
        ${FLAYER_COLORS.map(
          (rgb, i) => `
        @keyframes flayerGlow${i} {
          0%, 100% {
            box-shadow:
              0 0 18px 4px rgba(${rgb},0.22),
              0 0 50px 10px rgba(${rgb},0.07);
          }
          50% {
            box-shadow:
              0 0 32px 8px rgba(${rgb},0.45),
              0 0 80px 20px rgba(${rgb},0.14);
          }
        }
        .flayer-card-${i} {
          animation: flayerGlow${i} 2.5s ease-in-out infinite;
        }
        .flayer-card-${i}:hover {
          animation: none;
          box-shadow:
            0 0 55px 16px rgba(${rgb},0.72),
            0 0 110px 35px rgba(${rgb},0.28);
        }
        `
        ).join('\n')}
        .flayer-card {
          border-radius: 8px;
          overflow: hidden;
          transition: box-shadow 0.3s ease;
        }
      `}</style>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {visible.map((flayer, i) => {
          const card = (
            <div className={`flayer-card flayer-card-${i % FLAYER_COLORS.length} aspect-[3/4] relative`}>
              <img
                src={flayer.image}
                alt="Flayer"
                className="w-full h-full object-cover"
              />
              {flayer.buttonLabel && flayer.link && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center px-4">
                  <a
                    href={flayer.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-sm px-5 py-2 rounded"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {flayer.buttonLabel}
                  </a>
                </div>
              )}
            </div>
          )

          return flayer.link ? (
            <a
              key={flayer.id}
              href={flayer.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              {card}
            </a>
          ) : (
            <div key={flayer.id}>{card}</div>
          )
        })}
      </div>
    </section>
  )
}
