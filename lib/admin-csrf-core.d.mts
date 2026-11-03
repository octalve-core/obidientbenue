export type AdminAction='export'|'logout';
export type AdminCheckReason='ok'|'cross_site'|'fetch_site'|'origin'|'session'|'missing_proof'|'server_config'|'invalid_proof';
export function generateAdminProof(session:string,secret:string,action:AdminAction):string;
export function checkAdminProof(input:{
 session:string|undefined; secret:string|undefined;action:AdminAction;token:unknown;
 origin:string|null;fetchSite:string|null
}):{ok:boolean;reason:AdminCheckReason};
