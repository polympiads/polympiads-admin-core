import { useMatches } from "@tanstack/react-router";
import type { BreadcrumbsProps } from "../../components/nav/Breadcrumbs";

export default function useRouteBreadcrumbs (): BreadcrumbsProps {
    const matches = useMatches();

    return {
        "breadcrumbs": matches
            .map(match => {
                const brd = match.staticData.breadcrumb;

                if (brd === undefined) {
                    return undefined;
                }

                return { route: match.routeId, brd: brd }
            })
            .filter(match => match !== undefined)
            .map( ({route, brd}) => ({
                "id": route,
                "label": brd.getTitle,
                "link" : brd.getLink
            }) )
    }
}
