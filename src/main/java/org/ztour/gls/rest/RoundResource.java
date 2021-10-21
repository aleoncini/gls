package org.ztour.gls.rest;

import java.util.List;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.NotFoundException;

import org.bson.types.ObjectId;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.ztour.gls.model.HoleInfo;
import org.ztour.gls.model.Round;
import org.ztour.gls.model.Tournament;

@Path("/rounds")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class RoundResource {
    
    @GET
    public List<Round> list() {
        return Round.listAll();
    }

    @GET
    @Path("/{tournamentId}")
    public List<Round> getByTournament(@PathParam("tournamentId") String tournamentId) {
        return Round.getRoundsByTournament(tournamentId);
    }

    @POST
    public Round create(Round round) {
        round.persist();
        return round;
    }

    @POST
    @Path("/{roundId}/{hole}/{strokes}")
    public HoleInfo setHole(@PathParam("roundId") String roundId, @PathParam("hole") int hole, @PathParam("strokes") int strokes) {
        Round round = Round.findById(new ObjectId(roundId));
        round.setHole(hole, strokes);
        round.update();
        HoleInfo info = new HoleInfo();
        info.roundId = roundId;
        info.hole = hole;
        info.strokes = strokes;
        info.phcp = round.phcp;
        return info;
    }
}
