import dynamic from 'next/dynamic';

const CBridgeNoSSR = dynamic(() => import("../../celer/cBridgeTransferWidget"))

export default function cbridge() {
    return <div>
        <CBridgeNoSSR/>
    </div>
}