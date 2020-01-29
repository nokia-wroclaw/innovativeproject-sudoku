import "./Stats.scss";
import React, { useEffect, useContext, useState } from "react";
import { useHistory } from "react-router";
import { Table, TableRow, TableCell } from "@material-ui/core";
import GoBackButton from "../GoBackButton/GoBackButton";
import LoggedContext from "../../contexts/LoggedContext";

const EmptyStats = { top5: [], player_stats: {} };
const roman = ["I", "II", "III", "IV", "V"];

const Stats = () => {
  const history = useHistory();
  const isLogged = useContext(LoggedContext);
  const [stats, updateStats] = useState(EmptyStats);
  useEffect(() => {
    if (!isLogged) {
      history.replace("/login");
    }
  }, [isLogged, history]);

  const renderTop5 = () => (
    <TableRow>
      <TableCell align="center">
        <p>
          <h4>Player:</h4>
        </p>
        {stats.top5.map((player, index) => (
          <p key="index">
            <b>{roman[index]}.</b> {player.username}{" "}
          </p>
        ))}
      </TableCell>
      <TableCell align="center">
        <p>
          <h4>Games won:</h4>
        </p>
        {stats.top5.map(player => (
          <p key="index">
            {" "}
            <b>{player.games_won}</b>{" "}
          </p>
        ))}
      </TableCell>
    </TableRow>
  );
  const renderMyStats = () => (
    <TableRow align="center">
      <TableCell>
        <h5>
          <p>Games played: {stats.player_stats.games_total}</p>
          <p> Games won: {stats.player_stats.games_won}</p>
        </h5>
      </TableCell>
      <TableCell>
        <p>Attacks: {stats.player_stats.attacks}</p>
        <p>Heals: {stats.player_stats.heals}</p>
        <p>
          Total time playing: {Math.round(stats.player_stats.time_spend / 60)}m{" "}
          {Math.round(stats.player_stats.time_spend % 60)}s
        </p>
      </TableCell>
    </TableRow>
  );

  const displayStats = () => {
    return (
      <div>
        <p>
          <h2>Top 5:</h2>
        </p>
        <Table>{renderTop5()}</Table>
        <p>
          <h2>Your statistics: </h2>
        </p>
        <Table>{renderMyStats()}</Table>
      </div>
    );
  };

  useEffect(() => {
    const statistics = async () => {
      try {
        fetch(`/api/stats`)
          .then(res => res.json())
          .then(res => updateStats(res));
      } catch (e) {
        console.log("Stats error");
      }
    };
    statistics();
  }, []);

  return (
    <div className="Statistics">
      <GoBackButton />
      <div className="card">{displayStats()}</div>
    </div>
  );
};

export default Stats;
