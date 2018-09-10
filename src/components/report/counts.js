export const groupByItemId = arr => {
  return arr.reduce((rv, x) => {
    let v = x.context.item_id;
    let el = rv.find((r) => r && r[0].context.item_id === v);
    if (el) { el.push(x); }
    else { rv.push([x]); }
    return rv;
  }, []);
};