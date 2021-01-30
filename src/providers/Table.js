import { JsonRpc } from 'eosjs'

let rpc;

export const set_url = (url) => {
  rpc = new JsonRpc(url);
}

export const get_table = async (code, scope, table, limit, next) => {
  return rpc.get_table_rows({
    json: true,
    code: code,
    scope: scope,
    table: table,
    limit: limit,
    lower_bound: next,
    reverse: false,
    show_payer: false
  });
};