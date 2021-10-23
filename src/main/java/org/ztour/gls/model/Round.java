package org.ztour.gls.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.quarkus.mongodb.panache.PanacheMongoEntity;
import io.quarkus.mongodb.panache.common.MongoEntity;

@MongoEntity(collection="scores")
public class Round extends PanacheMongoEntity {
    public String tournamentId;
    public String playerName;
    public String playerId;
    public int phcp;
    public int day;
    public Map<String,Integer> holes; 

    public static List<Round> getRoundsByTournament(String tournamentId){
        return Round.find("tournamentId = ?1", tournamentId).list();
    }

    public Round setHole(int holeNumber, int strokes){
        if(holeNumber < 1){
            return this;
        }
        if(holeNumber > 18){
            return this;
        }
        if(holes == null){
            holes = new HashMap<String,Integer>();
        }
        holes.put("" + holeNumber, strokes);
        return this;
    }
}
