package team.bham.service.dto;

import java.time.Duration;
import java.time.LocalDate;

public class PointsDTO {

    private Long groupID;
    private String groupName;
    private Integer groupPoints;
    private Duration remainingTime;
    private LocalDate currentDate;
    private String login;
    private String imageUrl;
    private Integer currentPoints;
    private Integer previousPoints;
    private Integer totalPoints;

    public PointsDTO(
        Long groupID,
        String groupName,
        Integer groupPoints,
        Duration remainingTime,
        LocalDate currentDate,
        String login,
        String imageUrl,
        Integer currentPoints,
        Integer previousPoints,
        Integer totalPoints
    ) {
        this.groupID = groupID;
        this.groupName = groupName;
        this.groupPoints = groupPoints;
        this.remainingTime = remainingTime;
        this.currentDate = currentDate;
        this.login = login;
        this.imageUrl = imageUrl;
        this.currentPoints = currentPoints;
        this.previousPoints = previousPoints;
        this.totalPoints = totalPoints;
    }

    public Long getGroupID() {
        return groupID;
    }

    public void setGroupID(Long groupID) {
        this.groupID = groupID;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public Integer getGroupPoints() {
        return groupPoints;
    }

    public void setGroupPoints(Integer groupPoints) {
        this.groupPoints = groupPoints;
    }

    public Duration getRemainingTime() {
        return remainingTime;
    }

    public void setRemainingTime(Duration remainingTime) {
        this.remainingTime = remainingTime;
    }

    public LocalDate getCurrentDate() {
        return currentDate;
    }

    public void setCurrentDate(LocalDate currentDate) {
        this.currentDate = currentDate;
    }

    public String getlogin() {
        return login;
    }

    public void setlogin(String login) {
        this.login = login;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Integer getCurrentPoints() {
        return currentPoints;
    }

    public void setCurrentPoints(Integer currentPoints) {
        this.currentPoints = currentPoints;
    }

    public Integer getPreviousPoints() {
        return previousPoints;
    }

    public void setPreviousPoints(Integer previousPoints) {
        this.previousPoints = previousPoints;
    }

    public Integer getTotalPoints() {
        return totalPoints;
    }

    public void setTotalPoints(Integer totalPoints) {
        this.totalPoints = totalPoints;
    }
}
