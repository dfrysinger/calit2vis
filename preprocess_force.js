(function() {
  preprocess = {

    links: function(nodes) {
      var map = {},
          node_arr = [],
          country_map = {},
          country_array = [],
          type_map = {},
          type_array = [],
          link = [],
          i = 0,
          j = 0,
          k = 0;

      function makeMap(name, data){
        var node = map[name];
        if(!node){
          node = map[name] = {name: name, key: i, links: 0, dvalue: 0};
          node_arr[i] = node;
          i++;
        }
        if(data.Vertex1 !== undefined){
          if(data.DollarValue !== undefined && data.DollarValue.charAt(0) == "$"){
            var re = new RegExp("[$,]", "g");
            node.dvalue = data.DollarValue.replace(re, "");
          }
          if(node.country == undefined && data.Country != undefined){
            if(country_map[data.Country] == undefined){
              country_map[data.Country] = {name: data.Country, key: j};
              country_array[j] = country_map[data.Country];
              j++;
            }
            node.country = data.Country;
            node.country_code = country_map[data.Country].key;
          }
          if(node.type == undefined && data.PartnerType != undefined){
            if(type_map[data.PartnerType] == undefined){
              type_map[data.PartnerType] = {name: data.PartnerType, key: k};
              type_array[k] = type_map[data.PartnerType];
              k++;
            }
            node.type = data.PartnerType;
            node.type_code = type_map[data.PartnerType].key;
          }
          node_arr[node.key] = node;
        }
      }

      nodes.forEach(function(d) {
        makeMap(d.Vertex1, {});
        makeMap(d.Vertex2, d)
      });

      nodes.forEach(function(d) {
        if (d.Vertex2.length && d.Vertex1.length) {
          map[d.Vertex2].links++;
          map[d.Vertex1].links++;
          link.push({source: map[d.Vertex1].key, target: map[d.Vertex2].key});
        }
      });

      return {nodes: node_arr, links: link, countries: country_array, types: type_array};
    }

  };
})();
