import imgAppleStoreIOs from "figma:asset/51ebce5fbe2e67f532bca632f91e0416a434913d.png";
import imgAppleStoreIOs1 from "figma:asset/1ba102e412609c821e93a4e41e58e044a1d80047.png";

export default function YourDevicesOnAppleStoreIOs() {
  return (
    <div className="content-start flex flex-wrap gap-[80px] items-start relative size-full" data-name="Your devices on Apple Store (iOS)">
      <div className="h-[2556px] relative shrink-0 w-[1125px]" data-name="Apple Store (iOS)">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgAppleStoreIOs} />
      </div>
      <div className="h-[2556px] relative shrink-0 w-[1125px]" data-name="Apple Store (iOS)">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgAppleStoreIOs1} />
      </div>
    </div>
  );
}