import { useRouter } from "next/router";
import cx from "classnames";
import Link from "next/link";

interface Props {
  href: string;
  as?: string;
  style?: string;
  children?: any;
}

const NavLink = ({ href, style, children, as }: Props) => {
  const { pathname } = useRouter();
  const disabled: boolean = pathname === href;

  return (
    <span className={cx(style, { disabled })}>
      <Link href={href} as={as}>
        <a>{children}</a>
      </Link>
    </span>
  );
};

export default NavLink;
