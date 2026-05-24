import imgAppleStoreIOs from "figma:asset/33a979e0e2236ed6753428edaf8b8d4cc81d5ecc.png";
import imgAppleStoreIOs1 from "figma:asset/ff60070c86403c080555ac99eaf910f0017b93a2.png";
import imgAppleStoreIOs2 from "figma:asset/37c96aaa0afe155112352869b559ea69ab0849ba.png";

export default function FindingAStoreOnAppleStoreIOs() {
  return (
    <div className="content-start flex flex-wrap gap-[80px] items-start relative size-full" data-name="Finding a store on Apple Store (iOS)">
      <div className="h-[2556px] relative shrink-0 w-[1125px]" data-name="Apple Store (iOS)">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgAppleStoreIOs} />
      </div>
      <div className="h-[2556px] relative shrink-0 w-[1125px]" data-name="Apple Store (iOS)">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgAppleStoreIOs1} />
      </div>
      <div className="h-[2556px] relative shrink-0 w-[1125px]" data-name="Apple Store (iOS)">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgAppleStoreIOs2} />
      </div>
    </div>
  );
}