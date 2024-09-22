
const RWD = artifacts.require('RWD')
const Tether = artifacts.require('Tether')
const DecentralBank = artifacts.require('DecentralBank')

require('chai')
.use(require('chai-as-promised'))
.should()


contract ('DecentralBank', ([owner, customer]) => {
    let tether, rwd, decentralBank

    let tokens = (amount) => web3.utils.toWei(amount, 'ether')

    before(async () => {
        tether = await Tether.new()
        rwd = await RWD.new()
        decentralBank = await DecentralBank.new(rwd.address, tether.address)

        await rwd.transfer(decentralBank.address, tokens('1000000'))
        await tether.transfer(customer, tokens('100'), { from: owner})

    })


    describe('Mock Tether Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await tether.name()
            assert.equal(name, 'Mock Tether')
        })
    })

    describe('Reward Token Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await rwd.name()
            assert.equal(name, 'Reward Token')
        })
    })

    describe('Bank Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await decentralBank.name()
            assert.equal(name, 'Decentralised Bank')
        })

        it('contract received tokens', async () => {
            let balance = await rwd.balanceOf(decentralBank.address)
            assert.equal(balance, tokens('1000000'))
        })
    })

    describe('Yield Farming', async () => {
        it('rewards tokens for staking', async () => {
            let result;

            result = await tether.balanceOf(customer)
            assert.equal(result.toString(), tokens('100'), 'customer wallet balance before staking')
            
            await tether.approve(decentralBank.address, tokens('100'), {from: customer})
            await decentralBank.depositTokens(tokens('100'), {from: customer})

            result = await tether.balanceOf(customer)
            assert.equal(result.toString(), tokens('0'), 'customer wallet balance before staking')
       
            result = await tether.balanceOf(decentralBank.address)
            assert.equal(result.toString(), tokens('100'), 'decentral bank wallet balance after staking')
       
            result = await  decentralBank.isStaking(customer)
            assert.equal(result.toString(), 'true', 'customer is statking status after staking')
        })
    })
})

