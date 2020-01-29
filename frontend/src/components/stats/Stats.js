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
  const [stats, setStats] = useState(EmptyStats);
  useEffect(() => {
    if (!isLogged) {
      history.replace("/login");
    }
  }, [isLogged, history]);

  const renderTop5 = () => (
    <TableRow>
      <TableCell align="left">
        <p>
          <h4>Player</h4>
        </p>
        {stats.top5.map((player, index) => (
          <p key={player.username}>
            <b>{roman[index]}.</b> {player.username}{" "}
          </p>
        ))}
      </TableCell>
      <TableCell align="center">
        <p>
          <h4>Wins</h4>
        </p>
        {stats.top5.map(player => (
          <p key={player.username}>
            {" "}
            <b>{player.games_won}</b>{" "}
          </p>
        ))}
      </TableCell>
    </TableRow>
  );
  const renderMyStats = () => (
    <TableRow>
      <TableCell align="left">
        <p>Games: </p>
        <p>Wins: </p>
        <p>Attacks: </p>
        <p>Heals: </p>
        <p>Time in game: </p>
      </TableCell>

      <TableCell align="center">
        <p>{stats.player_stats.games_total}</p>
        <p>{stats.player_stats.games_won}</p>
        <p>{stats.player_stats.attacks}</p>
        <p>{stats.player_stats.heals}</p>
        <p>
          {Math.round(stats.player_stats.time_spend / 60)}m{" "}
          {Math.round(stats.player_stats.time_spend % 60)}s
        </p>
      </TableCell>
    </TableRow>
  );

  const displayStats = () => {
    return (
      <div>
        <p>
          <h2>Top 5</h2>
        </p>
        <Table>{renderTop5()}</Table>
        <p>
          <h2>Your statistics </h2>
        </p>
        <Table>{renderMyStats()}</Table>
      </div>
    );
  };

  useEffect(() => {
    try {
      fetch(`/api/stats`)
        .then(res => res.json())
        .then(res => setStats(res));
    } catch (e) {
      console.log("Stats error");
    }
  }, []);

  return (
    <div className="Statistics">
      <GoBackButton />
      <div className="card">{displayStats()}</div>
    </div>
  );
};

export default Stats;
