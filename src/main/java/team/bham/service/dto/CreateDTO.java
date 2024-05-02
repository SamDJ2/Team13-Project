package team.bham.service.dto;

public class CreateDTO {

    private Long id;
    private boolean leader;

    public CreateDTO() {}

    public Long getid() {
        return id;
    }

    public void setid(Long id) {
        this.id = id;
    }

    public boolean isLeader() {
        return leader;
    }

    public void setLeader(boolean leader) {
        this.leader = leader;
    }
}
