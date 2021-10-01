import { DateTime } from 'luxon';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Form } from 'react-bootstrap';
import IPage from '../interfaces/page';
import { v4 as uuid4 } from 'uuid';
import { RouteComponentProps, withRouter } from 'react-router-dom';


interface IHoliday {
  id?: string;
  name: string;
  days: number;
}

interface ITeamMember {
  id?: string;
  name: string;
  days: number;
}

interface ITableRowVM {
  model: ITeamMember | IHoliday
  onChange(model: ITeamMember | IHoliday): void;
  onDelete(model: ITeamMember | IHoliday): void;
}

function TableRow({ model, onChange, onDelete } : ITableRowVM) {
  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      id: model.id,
      name: e.target.value,
      days: model.days
    })
  };

  const onDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let days = model.days
    try {
      days = parseInt(e.target.value)
    } catch(e) {
      console.log("failed to convert days to number")
    }
    onChange({
      id: model.id,
      name: model.name,
      days: days
    })
  };

  return (
    <tr>
      <td style={{width: "60%"}}>
        <Form.Control type='text' value={model.name} onChange={onNameChange}/>
      </td>
      <td>
        <Form.Control type='text' value={model.days} onChange={onDaysChange}/>
      </td>
      <td>
        <button onClick={e => onDelete(model)} className='btn btn-sm btn-danger'>Remove</button>
      </td>
    </tr>
  );
}

const VelocityPlannerPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {
  useEffect(() => {
    console.log(`Loading ${props.name}`)
  }, [props.name])

  const [capacityLoadPct, setCapacityLoadPct] = useState<number>(90);
  const [memberBaseCapacity, setMemberBaseCapacity] = useState<number>(8);
  const [sprintStart, setSprintStart] = useState<string>(DateTime.now().toISODate());
  const [sprintEnd, setSprintEnd] = useState<string>(DateTime.now().toISODate());
  const [teamMembers, setTeamMembers] = useState<ITeamMember[]>([{ id: uuid4(), name: '', days: 0 }]);
  const [holidays, setHolidays] = useState<ITeamMember[]>([{ id: uuid4(), name: '', days: 0 }]);
  const [showingTeamMembersHelp, setShowingTeamMembersHelp] = useState<boolean>(false);
  const [showingHolidayHelp, setShowingHolidayHelp] = useState<boolean>(false);

  const onBaseCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let baseCap = memberBaseCapacity
    try {
      baseCap = Number.parseInt(e.target.value);
    } catch(e) {
      console.log('cannot parse value into integer')
    }
    setMemberBaseCapacity(baseCap);
  };

  const onSprintStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let start = DateTime.fromISO(sprintStart);
    try {
      start = DateTime.fromISO(e.target.value);
    } catch(e) {
      console.log("cannot parse start date");
    }

    let end = DateTime.fromISO(sprintEnd)
    if (end < start) {
      end = end.plus({ days: 14 })
    }

    setSprintStart(start.toISODate())
    setSprintEnd(end.toISODate())
  };

  const onSprintEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let end = DateTime.fromISO(sprintStart);
    try {
      end = DateTime.fromISO(e.target.value);
    } catch(e) {
      console.log("cannot parse end date");
    }

    let start = DateTime.fromISO(sprintStart)
    if (start > end) {
      start = start.minus({ days: 14 })
    }

    setSprintStart(start.toISODate())
    setSprintEnd(end.toISODate())
  };

  const onTeamMemberRowChange = (model: ITeamMember) => {
    const tm = teamMembers.find(tm => tm.id === model.id);
    const teamMembersCopy: ITeamMember[] = teamMembers.slice()
    if (tm) {
      tm.name = model.name
      tm.days = model.days
    }
    setTeamMembers(teamMembersCopy)
  };

  const onTeamMemberRowDelete = (tm: ITeamMember) => {
    const i = teamMembers.findIndex(t => t.id === tm.id);
    const teamMembersCopy: ITeamMember[] = teamMembers.slice()
    if (i > -1) {
      teamMembersCopy.splice(i, 1)
    }
    setTeamMembers(teamMembersCopy)
  };

  const onAddTeamMemberTableRow = (e: React.MouseEvent) => {
    const teamMembersCopy: ITeamMember[] = teamMembers.slice()
    teamMembersCopy.push({ id: uuid4(), name: '', days: 0 })
    setTeamMembers(teamMembersCopy)
  };

  const onHolidayRowChange = (model: IHoliday) => {
    const h = holidays.find(t => t.id === model.id);
    const holidaysCopy: IHoliday[] = holidays.slice()
    if (h) {
      h.name = model.name
      h.days = model.days
    }
    setHolidays(holidaysCopy)
  };

  const onHolidayRowDelete = (m: IHoliday) => {
    const i = holidays.findIndex(t => t.id === m.id);
    const holidaysCopy: IHoliday[] = holidays.slice()
    if (i > -1) {
      holidaysCopy.splice(i, 1)
    }
    setHolidays(holidaysCopy)
  };

  const onAddHolidayTableRow = (e: React.MouseEvent) => {
    const holidaysCopy: IHoliday[] = holidays.slice()
    holidaysCopy.push({ id: uuid4(), name: '', days: 0 })
    setHolidays(holidaysCopy)
  };

  const calcFullCapacity = () => {
    const end = DateTime.fromISO(sprintEnd)
    let workDays = 0
    let cur = DateTime.fromISO(sprintStart); 
    while (cur <= end) {
      if (cur.weekday !== 6 && cur.weekday !== 7) {
        workDays++
      }
      cur = cur.plus({ days: 1 })
    }

    const velocityPerPersonDay = memberBaseCapacity / workDays
    const members = teamMembers.filter(tm => tm.name)

    const personWorkDays = workDays * members.length
    const personVacationDays = members.reduce((acc, tm) => acc + tm.days, 0)
    const personHolidays = holidays.filter(h => h.name).reduce((acc, h) => acc + h.days, 0)

    const value = (personWorkDays - personVacationDays - personHolidays) * velocityPerPersonDay

    return parseInt(value.toFixed(0))
  };

  const calcLoadCapacity = () => {
    const x = calcFullCapacity() * (capacityLoadPct / 100);
    return parseInt(x.toFixed(0))
  };

  const onCapcityLoadPctChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let x = capacityLoadPct;
    try {
      x = parseFloat(e.target.value)
    } catch(e) {
      console.log(e)
    }
    setCapacityLoadPct(x)
  };

  return (
    <>
      <div className='container-fluid'>
        <div className="p-5 mb-4 bg-light rounded-1">
          <div className='row'>
            <div className='offset-2 col-3'>
              <h4 className="text-center text-muted">Full Capacity Points</h4>
              <h2 className="display-1 text-center">{calcFullCapacity()}</h2>
            </div>
            <div className='col-3'>
              <div className='d-flex justify-content-center flex-column' style={{height: '100%'}}>
                <h2 className="display-3 text-center">{capacityLoadPct}%</h2>
                <p className='text-muted text-center'>(Percent Capacity Load)</p>
                <Form.Range value={capacityLoadPct} onChange={onCapcityLoadPctChange}/>
                
              </div>
            </div>
            <div className='col-3'>
              <h4 className="text-center text-muted">Load Capacity Points</h4>
              <h2 className="display-1 text-center">{calcLoadCapacity()}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className='container pb-4'>
        <div className="form-group row pb-2">
          <label htmlFor="member-base-velocity" className='offset-2 col-6 col-form-label'>Team Member Base Sprint Velocity</label>
          <div className="col-2">
            <Form.Control type="text" name="member_base_capacity" value={memberBaseCapacity} onChange={onBaseCapacityChange}/>
          </div>
        </div>

        <div className="form-group row pb-2">
          <label htmlFor="member-base-velocity" className='offset-2 col-6 col-form-label'>Sprint Start Date</label>
          <div className="col-2">
            <Form.Control type="date" name="sprint_start" value={sprintStart} onChange={onSprintStartChange}/>
          </div>
        </div>

        <div className="form-group row pb-2">
          <label htmlFor="member-base-velocity" className='offset-2 col-6 col-form-label'>Sprint End Date</label>
          <div className="col-2">
            <Form.Control type="date" name="sprint_end" value={sprintEnd} onChange={onSprintEndChange}/>
          </div>
        </div>

        <div className='card mx-5 my-4'>
          <div className='card-header'>Team Members (excluding SM and PO) <button onClick={onAddTeamMemberTableRow} className='btn btn-primary float-end'>Add</button></div>
          <div className='card-body'>
            <p>Enter name of each team member and the number of planned vacation days excluding Scrum Master (SM) and Product Owner (PO)</p>
            <p>Explanation: 
              <button onClick={e => setShowingTeamMembersHelp(!showingTeamMembersHelp)} className="btn btn-link">
                {showingTeamMembersHelp ? 'Hide' : 'Show'}
              </button>
            </p>
            {showingTeamMembersHelp && (
              <>
                <p className='ms-3'>Two team members John (US) and Jane (UK) with Jane taking 1 day of vacation and John taking 2 days of vacation.</p>
                <p className='ms-3'>There would be one row for Jane and a value of 1 for days off</p>
                <p className='ms-3'>There would be another row for John and a value of 2 for days off</p>
              </>
            )}
            <table className='table table-borderless'>
              <thead>
                <tr>
                  <th style={{width: "60%"}}>Name</th>
                  <th>Vacation Days</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map(tm => (
                  <TableRow
                    model={tm}
                    onChange={onTeamMemberRowChange}
                    onDelete={onTeamMemberRowDelete}/>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className='card mx-5 my-4'>
          <div className='card-header'>Holidays <button onClick={onAddHolidayTableRow} className='btn btn-primary float-end'>Add</button></div>
          <div className='card-body'>
            <p>Enter all Holidays that will take away team working days from any member of the team. For each holiday enter the number of person days will be missed.</p>
            <p>Explanation: 
              <button onClick={e => setShowingHolidayHelp(!showingHolidayHelp)} className='btn btn-link'>
                {showingHolidayHelp ? 'Hide' :  'Show'}
              </button>
            </p>
            {showingHolidayHelp && (
              <>
                <p className="ms-3">Two team members John (US) and Jane (UK) with both having Friday Dec 24th Holidays and Jane having a Holiday on Dec 27th.</p>
                <p className="ms-3">Christmas Eve Dec 25th would have 2 person days off.</p>
                <p className="ms-3">Bank Holiday on Dec 27th would have 1 person day off.</p>
              </>
            )}

            <table className='table table-borderless'>
              <thead>
                <tr>
                  <th style={{width: "60%"}}>Name</th>
                  <th>Person Days Off</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {holidays.map(tm => (
                  <TableRow
                    model={tm}
                    onChange={onHolidayRowChange}
                    onDelete={onHolidayRowDelete}/>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className='text-center ml-3'>Calculation methodology is based off suggested approach from <a href="https://www.scaledagileframework.com/iteration-planning/" target="_BLANK" rel='noreferrer'>Scaled Agile Framework (SAFe) Iteration Planning</a>.</p>
      </div>
    </>
  );
}

export default withRouter(VelocityPlannerPage);
