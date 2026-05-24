import imgAppleStoreIOs from "figma:asset/886ad94fe0a7ed9fea0532951a527fb3b5885654.png";
import imgAppleStoreIOs1 from "figma:asset/3e7e46241c8b6ab302d0f604ad989caa30cecde6.png";

export default function SearchOnAppleStoreIOs() {
  return (
    <div className="content-start flex flex-wrap gap-[80px] items-start relative size-full" data-name="Search on Apple Store (iOS)">
      <div className="h-[2556px] relative shrink-0 w-[1125px]" data-name="Apple Store (iOS)">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgAppleStoreIOs} />
      </div>
      <div className="h-[2556px] relative shrink-0 w-[1125px]" data-name="Apple Store (iOS)">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgAppleStoreIOs1} />
      </div>
    </div>
  );
}