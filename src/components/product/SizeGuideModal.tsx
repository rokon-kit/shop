import { Link } from 'react-router-dom'
import { useUI } from '../../context/UIContext'
import { Modal } from '../common/Modal'
import { SizeGuideContent } from './SizeGuideContent'

export function SizeGuideModal() {
  const { sizeGuide, closeSizeGuide } = useUI()
  return (
    <Modal open={!!sizeGuide} onClose={closeSizeGuide} title="Size guide">
      <div className="p-5 sm:p-8">
        <h3 className="display mb-2 text-4xl">Find your fit</h3>
        <p className="mb-8 max-w-lg text-sm text-smoke">
          Our garments are cut for South Asian proportions. Not sure? Message us on WhatsApp with your height and weight and we will recommend a size.
        </p>
        {sizeGuide && <SizeGuideContent initial={sizeGuide} />}
        <Link to="/size-guide" onClick={closeSizeGuide} className="label link-u-static mt-8 inline-block">
          Open full size guide
        </Link>
      </div>
    </Modal>
  )
}
