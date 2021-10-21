package org.ztour.gls.model;

import io.quarkus.mongodb.panache.PanacheMongoEntity;
import io.quarkus.mongodb.panache.common.MongoEntity;

@MongoEntity(collection="tournaments")
public class Tournament extends PanacheMongoEntity {
    
    public String title;
    public String location;
    public String date;
    public String formula;

}
