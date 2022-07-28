import {IWaitingList} from "./IWaitingList";
import {IThing} from "../things/IThing";
import {IBorrower} from "../people/IBorrower";
import {Reservation} from "./reservation";
import {TimeInterval} from "../../valueItems/timeInterval";
import {ThingStatus} from "../../valueItems/thingStatus";
import {IdFactory} from "../../factories/idFactory";
import {ReservationStatus} from "../../valueItems/reservationStatus";

export abstract class BaseWaitingList implements IWaitingList {
    private readonly _item: IThing
    private _currentReservation: Reservation | null
    protected _expiredReservations: Reservation[]
    protected idFactory: IdFactory

    protected constructor(item: IThing, idFactory: IdFactory, currentReservation : Reservation | null = null, expiredReservations: Reservation[] = []) {
        this._item = item
        this._currentReservation = currentReservation
        this._expiredReservations = expiredReservations
        this.idFactory = idFactory
    }

    abstract add(borrower: IBorrower): IWaitingList;

    abstract findNextBorrower(): IBorrower | null;

    abstract isOnList(borrower: IBorrower): boolean;

    abstract processReservationExpired(reservation: Reservation): IWaitingList
    abstract cancel(borrower: IBorrower): IWaitingList

    protected abstract getReservationTime(): TimeInterval

    get item(): IThing {
        return this._item
    }

    get currentReservation(): Reservation | null {
        return this._currentReservation
    }

    protected clearCurrentReservation() {
        this._currentReservation = null
    }

    public reserveItemForNextBorrower(): Reservation {
        if(this.currentReservation){
            throw new Error("This item already has a reservation, please remove that first")
        }

        const next = this.findNextBorrower();
        if(!next){
            throw new Error("No borrower is waiting for this item!")
        }

        const goodUntil = this.getReservationTime().fromNow();

        // change item status
        this.item.status = ThingStatus.RESERVED

        const res = new Reservation(this.idFactory.makeReservationID(), next, this.item, goodUntil, ReservationStatus.ASSIGNED)
        this.cancel(next)
        this._currentReservation = this.currentReservation

        return res
    }
}
