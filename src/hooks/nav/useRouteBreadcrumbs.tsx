import { useMatches } from "@tanstack/react-router";
import type { BreadcrumbsProps } from "../../components/nav/Breadcrumbs";

export default function useRouteBreadcrumbs (): BreadcrumbsProps {
    const matches = useMatches();

    return {
        "breadcrumbs": matches
            .map(match => match.staticData.breadcrumb)
            .filter(match => match !== undefined)
            .map( brd => ({
                "label": brd.getTitle,
                "link" : brd.getLink
            }) )
    }
}
