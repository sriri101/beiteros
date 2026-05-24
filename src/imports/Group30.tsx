import img41 from "figma:asset/61d9291ceabbdb26824c0e4f5dea212211a9627e.png";

function ClipPathGroup() {
  return <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start row-1" data-name="Clip path group" />;
}

function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <ClipPathGroup />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 rounded-[24px] shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] size-[175.101px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(0, 174, 239) 0%, rgb(0, 137, 192) 100%)" }}>
      <Group />
    </div>
  );
}

export default function Group1() {
  return (
    <div className="relative size-full">
      <Container />
      <div className="absolute h-[166.358px] left-[8.76px] top-[4.38px] w-[159.791px]" data-name="4 1">
        <img alt="" className="absolute block max-w-none size-full" height="166.358" src={img41} width="159.791" />
      </div>
    </div>
  );
}