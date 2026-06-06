import { useMatches } from "@tanstack/react-router";
import type { AuthCheck } from "../../lib/permissions";

export default function useRouteAuthentication (): AuthCheck[] {
    const matches = useMatches();

    return matches
            .flatMap(match => match.staticData.auth)
            .filter(match => match !== undefined)
}
