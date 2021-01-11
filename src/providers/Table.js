import { JsonRpc } from 'eosjs'

let url = `
http://92d638329361.ngrok.io
`;

let rpc = new JsonRpc(url)

export const set_url = (url) => {
  url = url;
  rpc = new JsonRpc(url);
}

export const get_table = async (code, scope, table, limit) => {
  return rpc.get_table_rows({
    json: true,
    code: code,
    scope: scope,
    table: table,
    limit: limit,
    reverse: false,
    show_payer: false
  });
};