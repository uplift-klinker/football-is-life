export const PayloadTableColumns = {
    id: 'id',
    name: 'name',
    json: 'json',
    userCode: 'userCode',
    uid: 'uid',
    grantId: 'grantId',
}
export const PAYLOAD_SELECT_FIELDS = Object.values(PayloadTableColumns).join(', ');
export const PAYLOAD_TABLE_NAME = 'oidc_payload';