import React from 'react';
import './Table.css';
import users from './users.json';

class Table extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      pages: Math.ceil(this.editUsers().length/+this.props.pageSize),
      currentPage: 1,
      allUsers: this.editUsers(),
      recordsToShow: this.editUsers().slice(0, +this.props.pageSize),
      sorted: {
        sortName: 'index',
        order: 'asc'
      },
      lastSearch: ''
    };
  }

  editUsers = () => {
    const oldUsers = users.results;
    const editedUsers = [];
    oldUsers.forEach((user, index) => {
      let newUser =  {
        index: index + 1,
        fullName: user['name']['first'] + ' ' + user['name']['last'],
        gender: user.gender,
        age: user.dob.age,
        email: user.email,
        city: user.location.city,
        country: user.location.country,
      }
      editedUsers.push(newUser);
    });
    return editedUsers;
  }

  updateRecordsToShow = (page) => {
    const start = (page - 1) * this.props.pageSize;
    const fin = (page * this.props.pageSize > users.info.results) ? users.info.results : page * this.props.pageSize;

    this.setState({
      pages: Math.ceil(this.state.allUsers.length/+this.props.pageSize),
      currentPage: page,
      recordsToShow: this.state.allUsers.slice(start, fin),
    });
  }

  handleClick = (e) => {
    const page = e.currentTarget.value;
    let num = e.currentTarget.value;

    if (page === "prev") {
      if (this.state.currentPage > 1) {
        num = this.state.currentPage - 1;
      }
    } else if (page === "next") {
      if (this.state.currentPage < this.state.pages) {
        num = +this.state.currentPage + 1;
      }
    }
    this.updateRecordsToShow(+num);
  }

  handleSortClick = (e) => {
    let users = this.state.allUsers;
    let cellName = e.currentTarget.getAttribute("id");

    if (cellName === this.state.sorted.sortName) {
      if (this.state.sorted.order === 'asc') {
        this.setState({
          allUsers: users.reverse(),
          sorted: {
            sortName: cellName,
            order: 'desc',
          }
        });
      } else if (this.state.sorted.order === 'desc') {
        this.setState({
          allUsers: users.sort((a, b) => a["index"] > b["index"] ? 1 : -1),
          sorted: {
            sortName: 'index',
            order: 'asc'
          }
        });
      }
    } else {
      this.setState({
        allUsers: users.sort((a, b) => a[cellName] > b[cellName] ? 1 : -1),
        sorted: {
          sortName: cellName,
          order: 'asc'
        }
      });
    }
    this.updateRecordsToShow(this.state.currentPage);
  }

  createPagination() {
    let buttons = [];

    const prev = <button className="pagButton prev" disabled={this.state.currentPage === 1 ? true : false} value="prev" key="prev" id="pagButton-prev" onClick={this.handleClick}>Prev</button>
    buttons.push(prev);

    if (this.state.pages <= 10) {
      for (let i = 1; i <= this.state.pages; i++) {
        const pagButton = <button className={(i === this.state.currentPage ? "pagButton current" : "pagButton")} value={i} id={"pagButton-" + i} key={i} onClick={this.handleClick}>{i}</button>
        buttons.push(pagButton);
      }
    } else {
      let pagButton = <button className={(1 === this.state.currentPage ? "pagButton current" : "pagButton")} value="1" id="pagButton-1" key="1" onClick={this.handleClick}>1</button>
      buttons.push(pagButton);
      pagButton = <button className={(2 === this.state.currentPage ? "pagButton current" : "pagButton")} value="2" id="pagButton-2" key="2" onClick={this.handleClick}>2</button>
      buttons.push(pagButton);
      let pagDots = <span className={this.state.currentPage <= 4 ? "pagDots hidden" : "pagDots"}>...</span>;
      buttons.push(pagDots);

      for (let i = 3; i <= this.state.pages - 2; i++) {
        pagButton = <button 
          className={
            (i === this.state.currentPage 
              ? "pagButton current" 
              : (i === (this.state.currentPage + 1) || (i === this.state.currentPage - 1)) 
                ? "pagButton" 
                : "pagButton hidden"
            )} 
          value={i} 
          key={i} 
          onClick={this.handleClick}
        >
          {i}
        </button>
        buttons.push(pagButton);
      }
      pagDots = <span className={this.state.currentPage >= this.state.pages - 3 ? "pagDots hidden" : "pagDots"}>...</span>;
      buttons.push(pagDots);

      pagButton = <button className={(this.state.pages - 1 === this.state.currentPage ? "pagButton current" : "pagButton")} value={this.state.pages - 1} id={"pagButton-" + this.state.pages - 1} key={this.state.pages - 1} onClick={this.handleClick}>{this.state.pages - 1}</button>
      buttons.push(pagButton);
      pagButton = <button className={(this.state.pages === this.state.currentPage ? "pagButton current" : "pagButton")} value={this.state.pages} id={"pagButton-" + this.state.pages} key={this.state.pages} onClick={this.handleClick}>{this.state.pages}</button>
      buttons.push(pagButton);
    }

    const next = <button className="pagButton next" disabled={this.state.currentPage === this.state.pages ? true : false} value="next" key="next" id="pagButton-next" onClick={this.handleClick}>Next</button>
    buttons.push(next);

    return (
      <div className="pagination">
        {buttons}
      </div>
    );
  }

  handleChange = (e) => {
    const val = (e.currentTarget.value + '').toLowerCase();

    let records = this.editUsers();
    if (this.state.lastSearch && val.startsWith(this.state.lastSearch) && val.length > this.state.lastSearch.length) {
      records = this.state.allUsers;
    }
    
    if (val && val !== ' ') {
      const result = records.filter(obj => {
        const keys = Object.keys(obj);
        for (const key of keys) {
          let str = (obj[key] + '').toLowerCase();
          if (str.indexOf(val) !== -1) {
            return true;
          }
        }
        return false; 
      });
      
      this.setState({
        allUsers: result,
        lastSearch: val,
      });
    }
    this.updateRecordsToShow(this.state.currentPage);
  }

  render() {
    const filledRaws = this.state.recordsToShow.map((info) => {
      return (
        <tr className="row regRow" key={info.index}>
          <td className="tableCell regCell indexCell">{info.index}</td>
          <td className="tableCell regCell nameCell">{info.fullName}</td>
          <td className="tableCell regCell genderCell">{info.gender}</td>
          <td className="tableCell regCell ageCell">{info.age}</td>
          <td className="tableCell regCell emailCell">{info.email}</td>
          <td className="tableCell regCell cityCell">{info.city}</td>
          <td className="tableCell regCell countryCell">{info.country}</td>
        </tr>
      )
    });
    const pagination = this.createPagination();
  
    return (
      <div className="tableContainer">
        <table>
          <thead>
            <tr className="row headRow">
              <th className={this.state.sorted.sortName === "index" ? (this.state.sorted.order === "asc" ? "tableCell headCell indexCell asc" : "tableCell headCell indexCell desc") : "tableCell headCell indexCell"} id="index" onClick={this.handleSortClick}>№</th>
              <th className={this.state.sorted.sortName === "fullName" ? (this.state.sorted.order === "asc" ? "tableCell headCell nameCell asc" : "tableCell headCell nameCell desc") : "tableCell headCell nameCell"} id="fullName" onClick={this.handleSortClick}>Name</th>
              <th className={this.state.sorted.sortName === "gender" ? (this.state.sorted.order === "asc" ? "tableCell headCell genderCell asc" : "tableCell headCell genderCell desc") : "tableCell headCell genderCell"} id="gender" onClick={this.handleSortClick}>Gender</th>
              <th className={this.state.sorted.sortName === "age" ? (this.state.sorted.order === "asc" ? "tableCell headCell ageCell asc" : "tableCell headCell ageCell desc") : "tableCell headCell ageCell"} id="age" onClick={this.handleSortClick}>Age</th>
              <th className={this.state.sorted.sortName === "email" ? (this.state.sorted.order === "asc" ? "tableCell headCell emailCell asc" : "tableCell headCell emailCell desc") : "tableCell headCell emailCell"} id="email" onClick={this.handleSortClick}>Email</th>
              <th className={this.state.sorted.sortName === "city" ? (this.state.sorted.order === "asc" ? "tableCell headCell cityCell asc" : "tableCell headCell cityCell desc") : "tableCell headCell cityCell"} id="city" onClick={this.handleSortClick}>City</th>
              <th className={this.state.sorted.sortName === "country" ? (this.state.sorted.order === "asc" ? "tableCell headCell countryCell asc" : "tableCell headCell countryCell desc") : "tableCell headCell countryCell"} id="country" onClick={this.handleSortClick}>Country</th>
            </tr>
          </thead>
          <tbody className="tableBody">
            {filledRaws}
          </tbody>
          <tfoot>
            <tr>
              <div className="filterContainer">
                <label for="filter">Find:</label>
                <input type="text" className="filerInput" id="filter" onChange={this.handleChange}></input>
              </div>
              {pagination}
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
}

export default Table;