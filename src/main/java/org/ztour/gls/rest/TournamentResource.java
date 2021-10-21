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
import org.ztour.gls.model.Tournament;

@Path("/tournaments")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class TournamentResource {
    
    @GET
    public List<Tournament> list() {
        return Tournament.listAll();
    }

    @GET
    @Path("/{id}")
    public Tournament get(@PathParam("id") String id) {
        return Tournament.findById(new ObjectId(id));
    }

    @POST
    public Tournament create(Tournament tournament) {
        tournament.persist();
        return tournament;
    }

}
