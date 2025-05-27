import { league, allTimeLeagueIds } from "../initData.js";

var leagueData = league;


export async function getLeagueDrafts(leagueId) {
    const res  = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/drafts`);
    const data = await res.json();

    if(data){
        return data[0].draft_id;
    }

}

export async function getDraftPicks(draftId) {
    const res  = await fetch(`https://api.sleeper.app/v1/draft/${draftId}/picks`);
    const data = await res.json();

    return data;

}

export async function getDraftOrder(draftId) {
    const res  = await fetch(`https://api.sleeper.app/v1/draft/${draftId}`);
    const data = await res.json();
    const result = [];

    if(data) {
        result.push({
            "league_id" : data.league_id,
            "draft_id": data.draft_id,
            "draft_order": data.draft_order,
            "rounds": data.settings.rounds
        });

        return result;
    }

}