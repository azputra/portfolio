import { profile } from '../data/profile'
import './Marquee.scss'

const items = [...profile.skills, 'Technical Leadership', 'Remote Teams']

export function Marquee() {
  const track = [...items, ...items]

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {track.map((item, i) => (
          <span key={`${item}-${i}`} className="marquee__item">
            {item}
            <span className="marquee__dot">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
