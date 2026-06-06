
import { Link, type LinkProps } from '@tanstack/react-router'
import ChevronRight from '../icons/ChevronRight';

type Breadcrumb = {
    id : string;
    
    label : () => string;
    link ?: () => LinkProps;
};

interface BreadcrumbProps {
    breadcrumb : Breadcrumb;
    isActive   : boolean;
};

export interface BreadcrumbsProps {
    breadcrumbs: Breadcrumb[];
};

function Breadcrumb (props: BreadcrumbProps) {
    const textSpan = (
        <span
            className={props.isActive
                ? "text-[#1a2b3a] font-medium select-none"
                : "text-[#7a8f9f] font-medium select-none"}>{props.breadcrumb.label()}</span>
    )

    const link = props.breadcrumb.link?.();
    
    if (link) {
        return <Link {...link}>{textSpan}</Link>
    }

    return textSpan;
}

export default function Breadcrumbs (props: BreadcrumbsProps) {
    const childrens = props.breadcrumbs.flatMap(
        (value, index) => [
            ...(
                index == 0 ? []
                : [ <ChevronRight key={`${index}-chv`} size={20} className="text-[#b8c8d4]"/> ]
            ),
            <Breadcrumb
                key={value.id}
                breadcrumb={value}
                isActive={index == props.breadcrumbs.length - 1}/>
        ]
    );

    return <>
        <nav className="flex items-center gap-1.5 text-[11.5px]">
            {...childrens}
        </nav>
    </>
};
