import type { Flayer } from '@/types'

export function FlayersSection({ flayers }: { flayers: Flayer[] }) {
  if (!flayers.length) return null

  const visible = flayers.slice(0, 4)

  return (
    <section className="py-12 px-4">
      <style>{`
        @keyframes flayerGlow {
          0%, 100% {
            box-shadow:
              0 0 18px 4px rgba(201,162,39,0.22),
              0 0 50px 10px rgba(201,162,39,0.07);
          }
          50% {
            box-shadow:
              0 0 32px 8px rgba(201,162,39,0.45),
              0 0 80px 20px rgba(201,162,39,0.14);
          }
        }
        .flayer-card {
          animation: flayerGlow 2.5s ease-in-out infinite;
          border-radius: 8px;
          overflow: hidden;
          transition: box-shadow 0.3s ease;
        }
        .flayer-card:hover {
          animation: none;
          box-shadow:
            0 0 55px 16px rgba(201,162,39,0.72),
            0 0 110px 35px rgba(201,162,39,0.28);
        }
      `}</style>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {visible.map((flayer) => {
          const card = (
            <div className="flayer-card aspect-[3/4]">
              <img
                src={flayer.image}
                alt="Flayer"
                className="w-full h-full object-cover"
              />
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
