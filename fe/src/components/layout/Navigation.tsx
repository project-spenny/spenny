import NavItem from "../common/NavItem"

const Navigation = () => {
  return (
    <nav className="w-full p-2 md:w-28 md:h-full bg-neutral-100">
        <div className="flex flex-wrap text-sm gap-2 justify-center items-center md:flex-col">
            <NavItem label="홈" href="/"/>
            <NavItem label="내역" href=""/>
            <NavItem label="분석" href=""/>
            <NavItem label="고정비" href=""/>
            <NavItem label="마이페이지" href=""/>
        </div>
    </nav>
  )
}

export default Navigation