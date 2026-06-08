import { Composition } from 'remotion'
import { RegisPromo } from './RegisPromo'

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="RegisPromo"
        component={RegisPromo}
        durationInFrames={30 * 45} // 45 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  )
}
